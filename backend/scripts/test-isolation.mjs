import { createClient } from '@insforge/sdk';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read .env from backend root
const envPath = resolve(__dirname, '../.env');
const envContent = readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const [k, ...v] = trimmed.split('=');
        env[k.trim()] = v.join('=').trim();
    }
});

const baseUrl = env.INSFORGE_PROJECT_URL;
const anonKey = env.INSFORGE_ANON_KEY;

if (!baseUrl || !anonKey) {
    console.error('Missing INSFORGE_PROJECT_URL or INSFORGE_ANON_KEY in .env');
    process.exit(1);
}

const clientA = createClient({ baseUrl, anonKey });
const clientB = createClient({ baseUrl, anonKey });

async function getOrAuthUser(client, email, password, name) {
    // Try sign in
    let res = await client.auth.signInWithPassword({ email, password });
    if (!res.error && res.data?.accessToken) {
        return res.data.user;
    }
    // Try sign up
    res = await client.auth.signUp({ email, password, name });
    if (res.error) {
        // If already registered, try sign in again
        const retry = await client.auth.signInWithPassword({ email, password });
        if (retry.error) {
            throw new Error(`Auth failed for ${email}: ${retry.error.message || res.error.message}`);
        }
        return retry.data.user;
    }
    return res.data.user;
}

let passed = 0;
let failed = 0;

function assert(condition, testName, detail = '') {
    if (condition) {
        console.log(`PASS: ${testName}`);
        passed++;
    } else {
        console.error(`FAIL: ${testName} ${detail}`);
        failed++;
    }
}

async function run() {
    console.log('--- Starting Two-User RLS Isolation Tests ---');
    
    const userA = await getOrAuthUser(clientA, 'test_user_a@triagr.internal', 'Password123!', 'User Alpha');
    const userB = await getOrAuthUser(clientB, 'test_user_b@triagr.internal', 'Password123!', 'User Beta');

    console.log(`User A authenticated: ${userA.id}`);
    console.log(`User B authenticated: ${userB.id}`);

    // 1. User A creates/upserts profile
    const { error: profAError } = await clientA.database.from('profiles').insert([{
        user_id: userA.id,
        display_name: 'Alpha Operator',
        unit_label: 'Squadron 7'
    }]);
    // May fail on duplicate if already exists, try update
    if (profAError) {
        await clientA.database.from('profiles').update({ display_name: 'Alpha Operator' }).eq('user_id', userA.id);
    }

    // 2. User B tries to read User A's profile
    const { data: bReadingAProfile } = await clientB.database.from('profiles').select().eq('user_id', userA.id);
    assert(
        !bReadingAProfile || bReadingAProfile.length === 0,
        'User B cannot read User A profile'
    );

    // 3. User A reads own profile
    const { data: aOwnProfile } = await clientA.database.from('profiles').select().eq('user_id', userA.id);
    assert(
        aOwnProfile && aOwnProfile.length === 1 && aOwnProfile[0].user_id === userA.id,
        'User A can read own profile'
    );

    // 4. Client cannot insert into scenarios (Read-Only)
    const { error: scenarioInsertError } = await clientA.database.from('scenarios').insert([{
        slug: 'hacked-scenario',
        title: 'Hacked',
        family: 'bird_decoy_confusion',
        summary: 'Should fail',
        difficulty: 0.5,
        time_limit_s: 100,
        default_seed: 1
    }]);
    assert(
        scenarioInsertError !== null,
        'Client cannot insert into scenarios (default deny)'
    );

    // 5. Scenarios readable by authenticated user
    const { data: scenariosList } = await clientA.database.from('scenarios').select();
    assert(
        scenariosList && scenariosList.length > 0,
        'Authenticated user can read active scenarios'
    );
    const scenarioId = scenariosList[0].id;

    // 6. User A creates a session
    const { data: sessionAData, error: sessionAError } = await clientA.database.from('sessions').insert([{
        user_id: userA.id,
        scenario_id: scenarioId,
        seed: 42,
        status: 'in_progress'
    }]).select();
    assert(
        !sessionAError && sessionAData && sessionAData.length === 1,
        'User A can create session',
        sessionAError?.message
    );
    const sessionAId = sessionAData[0].id;

    // 7. User B tries to select User A's session
    const { data: bReadingASession } = await clientB.database.from('sessions').select().eq('id', sessionAId);
    assert(
        !bReadingASession || bReadingASession.length === 0,
        'User B cannot read User A session'
    );

    // 8. User B tries to insert an event into User A's session
    const { error: bInsertEventError } = await clientB.database.from('events').insert([{
        session_id: sessionAId,
        tick: 1,
        seq: 0,
        type: 'track.init',
        source: 'trainee',
        visibility: 'trainee',
        payload: { track_id: 'T1' }
    }]);
    assert(
        bInsertEventError !== null,
        'User B cannot insert events into User A session'
    );

    // 9. User A inserts event into own session
    const { data: aEventData, error: aEventError } = await clientA.database.from('events').insert([{
        session_id: sessionAId,
        tick: 1,
        seq: 0,
        type: 'track.init',
        source: 'trainee',
        visibility: 'trainee',
        payload: { track_id: 'T1' }
    }]).select();
    assert(
        !aEventError && aEventData && aEventData.length === 1,
        'User A can insert events into own session',
        aEventError?.message
    );

    // 10. User A cannot update or delete events (append-only)
    const { error: aUpdateEventError } = await clientA.database.from('events').update({
        payload: { hacked: true }
    }).eq('id', aEventData[0].id);
    assert(
        aUpdateEventError !== null,
        'User A cannot update events (append-only default deny)'
    );

    const { error: aDeleteEventError } = await clientA.database.from('events').delete().eq('id', aEventData[0].id);
    assert(
        aDeleteEventError !== null,
        'User A cannot delete events (append-only default deny)'
    );

    // 11. User A inserts a score for their session
    const { data: scoreAData, error: scoreAError } = await clientA.database.from('scores').insert([{
        session_id: sessionAId,
        user_id: userA.id,
        scoring_pack: 'standard_v1',
        comp_detection: 0.85,
        comp_classification: 0.90,
        s_raw: 87.5,
        s_final: 85.0
    }]).select();
    assert(
        !scoreAError && scoreAData && scoreAData.length === 1,
        'User A can insert score for own session',
        scoreAError?.message
    );
    const scoreAId = scoreAData[0].id;

    // 12. User B cannot read User A's score
    const { data: bReadingAScore } = await clientB.database.from('scores').select().eq('id', scoreAId);
    assert(
        !bReadingAScore || bReadingAScore.length === 0,
        'User B cannot read User A score'
    );

    // 13. Second score for the same session fails (unique constraint)
    const { error: duplicateScoreError } = await clientA.database.from('scores').insert([{
        session_id: sessionAId,
        user_id: userA.id,
        s_final: 90
    }]);
    assert(
        duplicateScoreError !== null,
        'Duplicate score for same session fails'
    );

    // 14. Score items: User A inserts score item
    const { data: itemData, error: itemError } = await clientA.database.from('score_items').insert([{
        score_id: scoreAId,
        rule_id: 'CLS-001',
        episode_id: 'T1',
        event_time_s: 12.4,
        expected_branch: 'quad_benign',
        selected_branch: 'quad_benign',
        points_raw: 1.0,
        points_weighted: 0.2
    }]).select();
    assert(
        !itemError && itemData && itemData.length === 1,
        'User A can insert score_item for own score',
        itemError?.message
    );

    // 15. User B cannot read User A's score items
    const { data: bReadingScoreItems } = await clientB.database.from('score_items').select().eq('score_id', scoreAId);
    assert(
        !bReadingScoreItems || bReadingScoreItems.length === 0,
        'User B cannot read User A score items'
    );

    // 16. Learner skill isolation
    const { error: skillError } = await clientA.database.from('learner_skill').upsert([{
        user_id: userA.id,
        skill: 'detect',
        theta: 0.45
    }]);
    assert(!skillError, 'User A can upsert learner_skill', skillError?.message);

    const { data: bReadingSkill } = await clientB.database.from('learner_skill').select().eq('user_id', userA.id);
    assert(
        !bReadingSkill || bReadingSkill.length === 0,
        'User B cannot read User A learner_skill'
    );

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    if (failed > 0) {
        process.exit(1);
    }
}

run().catch(err => {
    console.error('Fatal error in isolation test:', err);
    process.exit(1);
});
