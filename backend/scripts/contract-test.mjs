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
        console.log(`[PASS] ${testName}`);
        passed++;
    } else {
        console.error(`[FAIL] ${testName} ${detail}`);
        failed++;
    }
}

async function run() {
    console.log('====================================================');
    console.log('       TRIAGR BACKEND CONTRACT TEST SUITE          ');
    console.log('====================================================\n');

    // 1. Auth & Auto-Provisioned Profiles
    const userA = await getOrAuthUser(clientA, 'contract_user_a@triagr.internal', 'Password123!', 'Contract Alpha');
    const userB = await getOrAuthUser(clientB, 'contract_user_b@triagr.internal', 'Password123!', 'Contract Beta');
    assert(userA?.id && userB?.id, 'Users authenticated successfully');

    // Check auto profile trigger for User A
    const { data: profA } = await clientA.database.from('profiles').select().eq('user_id', userA.id);
    assert(
        profA && profA.length === 1 && profA[0].user_id === userA.id,
        'Profile auto-provisioned or readable for User A'
    );

    // 2. Profile Isolation
    const { data: bReadingAProfile } = await clientB.database.from('profiles').select().eq('user_id', userA.id);
    assert(
        !bReadingAProfile || bReadingAProfile.length === 0,
        'Profile isolation: User B cannot select User A profile'
    );

    // 3. Profile Update
    const { error: profUpdateError } = await clientA.database.from('profiles')
        .update({ unit_label: 'Tactical Recon Unit' })
        .eq('user_id', userA.id);
    assert(!profUpdateError, 'Profile update: User A can update own unit_label');

    // 4. Scenarios: Read-Only Contract
    const { data: activeScenarios, error: scnListError } = await clientA.database
        .from('scenarios')
        .select()
        .eq('is_active', true)
        .order('difficulty', { ascending: true });
    assert(
        !scnListError && activeScenarios && activeScenarios.length >= 8,
        'Scenarios: Authenticated user can read seeded scenarios (at least 8 active)',
        scnListError?.message
    );

    const { error: scnInsertError } = await clientA.database.from('scenarios').insert([{
        slug: 'malicious-scenario',
        title: 'Unauthorized Scenario',
        family: 'bird_decoy_confusion',
        summary: 'Should fail',
        difficulty: 0.5,
        time_limit_s: 180,
        default_seed: 9999
    }]);
    assert(scnInsertError !== null, 'Scenarios: Client INSERT is rejected (default deny)');

    const testScenario = activeScenarios[0];

    // 5. Sessions: Creation & Owner Isolation
    const sessionSeed = Date.now();
    const { data: sessionAData, error: sessionAError } = await clientA.database.from('sessions').insert([{
        user_id: userA.id,
        scenario_id: testScenario.id,
        seed: sessionSeed,
        status: 'in_progress',
        sim_source: 'mock',
        scoring_pack: 'standard_v1'
    }]).select();
    assert(
        !sessionAError && sessionAData && sessionAData.length === 1,
        'Sessions: User A can create a session',
        sessionAError?.message
    );
    const sessionAId = sessionAData[0].id;

    // Cross-user read check
    const { data: bReadingASession } = await clientB.database.from('sessions').select().eq('id', sessionAId);
    assert(
        !bReadingASession || bReadingASession.length === 0,
        'Sessions: User B cannot select User A session'
    );

    // 6. Constraint Validation: Bad Enum Rejection
    const { error: badStatusError } = await clientA.database.from('sessions').insert([{
        user_id: userA.id,
        scenario_id: testScenario.id,
        seed: 12345,
        status: 'invalid_status_enum'
    }]);
    assert(badStatusError !== null, 'Constraints: Invalid session status enum is rejected');

    // 7. Events: Append-Only Contract & Simulation Seam Payloads
    // Sample track.init event from simulation-seam.md
    const eventPayloads = [
        {
            session_id: sessionAId,
            tick: 10,
            seq: 0,
            type: 'track.init',
            source: 'sim',
            visibility: 'trainee',
            payload: {
                track_id: 'T15',
                position: { x: 1200.5, y: -450.2, z: 85.0 },
                uncertainty_m: 12.5,
                quality: 0.88
            }
        },
        {
            session_id: sessionAId,
            tick: 15,
            seq: 0,
            type: 'track.update',
            source: 'sim',
            visibility: 'trainee',
            payload: {
                track_id: 'T15',
                position: { x: 1180.0, y: -430.0, z: 82.0 },
                speed_mps: 22.4,
                heading_deg: 135.0,
                class_probs: { quad_benign: 0.15, fpv_hostile: 0.85 }
            }
        },
        {
            session_id: sessionAId,
            tick: 18,
            seq: 0,
            type: 'action.classify',
            source: 'trainee',
            visibility: 'trainee',
            payload: {
                track_id: 'T15',
                selected_class: 'fpv_hostile',
                hostility: 'hostile',
                confidence: 0.92,
                evidence_refs: ['track_id:T15', 'sensor:optical_ptz']
            }
        },
        {
            session_id: sessionAId,
            tick: 20,
            seq: 0,
            type: 'roe.authority_check',
            source: 'trainee',
            visibility: 'trainee',
            payload: {
                rule_id: 'ROE-ENGAGE-01',
                result: 'authorized'
            }
        }
    ];

    const { data: insertedEvents, error: eventsError } = await clientA.database
        .from('events')
        .insert(eventPayloads)
        .select();
    assert(
        !eventsError && insertedEvents && insertedEvents.length === 4,
        'Events: User A can batch insert simulation-seam events',
        eventsError?.message
    );

    // Cross-user event insert attempt
    const { error: bInsertEventError } = await clientB.database.from('events').insert([{
        session_id: sessionAId,
        tick: 25,
        seq: 0,
        type: 'action.select_effect',
        source: 'trainee',
        visibility: 'trainee',
        payload: { track_id: 'T15', effect_id: 'rf_jam_directional' }
    }]);
    assert(bInsertEventError !== null, 'Events: User B cannot insert events into User A session');

    // Duplicate key constraint: (session_id, tick, seq)
    const { error: duplicateEventError } = await clientA.database.from('events').insert([{
        session_id: sessionAId,
        tick: 10,
        seq: 0,
        type: 'track.init',
        source: 'sim',
        visibility: 'trainee',
        payload: { duplicate: true }
    }]);
    assert(duplicateEventError !== null, 'Events: Duplicate (session_id, tick, seq) is rejected');

    // Immutability: UPDATE and DELETE must fail
    const targetEventId = insertedEvents[0].id;
    const { error: updateEvError } = await clientA.database.from('events')
        .update({ payload: { tampered: true } })
        .eq('id', targetEventId);
    assert(updateEvError !== null, 'Events: Client UPDATE is blocked (immutability guard)');

    const { error: deleteEvError } = await clientA.database.from('events')
        .delete()
        .eq('id', targetEventId);
    assert(deleteEvError !== null, 'Events: Client DELETE is blocked (immutability guard)');

    // 8. Session Completion
    const { error: finishError } = await clientA.database.from('sessions').update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        log_hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }).eq('id', sessionAId);
    assert(!finishError, 'Sessions: User A can complete session');

    // 9. Scores & Score Items (Explainability contract from simulation-seam.md)
    const { data: scoreData, error: scoreError } = await clientA.database.from('scores').insert([{
        session_id: sessionAId,
        user_id: userA.id,
        scoring_pack: 'standard_v1',
        comp_detection: 0.850,
        comp_classification: 0.900,
        comp_identification: 0.800,
        comp_rules: 1.000,
        comp_execution: 0.750,
        comp_team: 0.700,
        comp_timeliness: 0.880,
        s_raw: 86.45,
        penalty: 0.00,
        s_final: 86.45,
        gates: []
    }]).select();
    assert(
        !scoreError && scoreData && scoreData.length === 1,
        'Scores: User A can insert deterministic score matching seam formula',
        scoreError?.message
    );
    const scoreAId = scoreData[0].id;

    // Unique score per session check
    const { error: dupScoreError } = await clientA.database.from('scores').insert([{
        session_id: sessionAId,
        user_id: userA.id,
        scoring_pack: 'standard_v1',
        s_final: 50.0
    }]);
    assert(dupScoreError !== null, 'Scores: Second score for same session is rejected');

    // Score items linked to score
    const { data: scoreItemsData, error: scoreItemsError } = await clientA.database.from('score_items').insert([
        {
            score_id: scoreAId,
            rule_id: 'CLS-003',
            episode_id: 'T15',
            event_time_s: 142.4,
            expected_branch: 'fpv_hostile',
            selected_branch: 'fpv_hostile',
            points_raw: 1.0,
            points_weighted: 0.20,
            penalty: 0,
            coaching_tag: 'TIMELY_CLASSIFICATION',
            evidence: { track_id: 'T15', observation_time_s: 3.4 }
        }
    ]).select();
    assert(
        !scoreItemsError && scoreItemsData && scoreItemsData.length === 1,
        'Score Items: User A can record explainability score items',
        scoreItemsError?.message
    );

    // Cross-user score read check
    const { data: bReadingScore } = await clientB.database.from('scores').select().eq('id', scoreAId);
    assert(
        !bReadingScore || bReadingScore.length === 0,
        'Scores: User B cannot select User A score'
    );

    // 10. Learner Skill Upsert & Read
    const { error: skillUpsertError } = await clientA.database.from('learner_skill').upsert([
        { user_id: userA.id, skill: 'classify', theta: 0.72 },
        { user_id: userA.id, skill: 'detect', theta: 0.65 }
    ]);
    assert(!skillUpsertError, 'Learner Skill: User A can upsert multiple skill abilities');

    const { data: bReadingSkill } = await clientB.database.from('learner_skill').select().eq('user_id', userA.id);
    assert(
        !bReadingSkill || bReadingSkill.length === 0,
        'Learner Skill: User B cannot select User A learner_skill'
    );

    // 11. History Query (PostgREST embedded join: sessions with scores)
    const { data: historyData, error: historyError } = await clientA.database
        .from('sessions')
        .select('*, scores(*)')
        .eq('user_id', userA.id)
        .order('started_at', { ascending: false });
    assert(
        !historyError && historyData && historyData.length > 0 && historyData[0].scores,
        'History Query: User A can retrieve session history with joined score',
        historyError?.message
    );

    console.log('\n====================================================');
    console.log(`TOTAL CHECKS: ${passed + failed}`);
    console.log(`PASSED:       ${passed}`);
    console.log(`FAILED:       ${failed}`);
    console.log('====================================================\n');

    if (failed > 0) {
        process.exit(1);
    }
}

run().catch(err => {
    console.error('Fatal execution error:', err);
    process.exit(1);
});
