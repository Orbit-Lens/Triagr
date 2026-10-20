/**
 * InsForge Edge Function: finalize-session
 * Evaluates simulation session events, applies scoring weights and safety gates,
 * and records verified scores and explainability items.
 */

import { createClient } from 'npm:@insforge/sdk';

const SCORING_WEIGHTS = {
    standard_v1: {
        D: 0.20, // Detection
        C: 0.20, // Classification
        I: 0.15, // Identification
        R: 0.20, // Rules of Engagement
        E: 0.10, // Execution
        B: 0.10, // Team / Coordination
        T: 0.05  // Timeliness
    }
};

function computeScore(components, penalty = 0, gates = [], pack = 'standard_v1') {
    const weights = SCORING_WEIGHTS[pack] || SCORING_WEIGHTS.standard_v1;
    
    const D = Math.max(0, Math.min(1, components.D ?? 0));
    const C = Math.max(0, Math.min(1, components.C ?? 0));
    const I = Math.max(0, Math.min(1, components.I ?? 0));
    const R = Math.max(0, Math.min(1, components.R ?? 0));
    const E = Math.max(0, Math.min(1, components.E ?? 0));
    const B = Math.max(0, Math.min(1, components.B ?? 0));
    const T = Math.max(0, Math.min(1, components.T ?? 0));

    const rawFloat = 100 * (
        weights.D * D +
        weights.C * C +
        weights.I * I +
        weights.R * R +
        weights.E * E +
        weights.B * B +
        weights.T * T
    );
    const s_raw = Math.round(rawFloat * 100) / 100;
    let s_final = Math.max(0, Math.min(100, s_raw - penalty));

    const firedGates = [];
    for (const gate of gates) {
        if (gate.code === 'EFFECT_WITHOUT_AUTHORITY') {
            s_final = Math.min(s_final, 40.0);
            firedGates.push('EFFECT_WITHOUT_AUTHORITY');
        } else if (gate.code === 'ROE_VIOLATION_CRITICAL') {
            s_final = Math.min(s_final, 30.0);
            firedGates.push('ROE_VIOLATION_CRITICAL');
        }
    }
    s_final = Math.round(s_final * 100) / 100;

    return {
        scoring_pack: pack,
        comp_detection: D,
        comp_classification: C,
        comp_identification: I,
        comp_rules: R,
        comp_execution: E,
        comp_team: B,
        comp_timeliness: T,
        s_raw,
        penalty,
        s_final,
        gates: firedGates
    };
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { session_id, components, penalty = 0, gates = [], score_items = [] } = req.body || {};

    if (!session_id) {
        return res.status(400).json({ error: 'Missing required session_id parameter' });
    }

    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: missing access token' });
    }

    const baseUrl = process.env.INSFORGE_PROJECT_URL || process.env.INSFORGE_BASE_URL;
    const anonKey = process.env.INSFORGE_ANON_KEY;
    const insforge = createClient({ baseUrl, anonKey });

    const { data: { user }, error: userError } = await insforge.auth.getCurrentUser(token);
    if (userError || !user) {
        return res.status(401).json({ error: 'Unauthorized: invalid token' });
    }

    // Verify session ownership
    const { data: sessions, error: sessionQueryError } = await insforge.database
        .from('sessions')
        .select()
        .eq('id', session_id)
        .eq('user_id', user.id);

    if (sessionQueryError || !sessions || sessions.length === 0) {
        return res.status(404).json({ error: 'Session not found or not owned by caller' });
    }

    // Check if score already exists
    const { data: existingScores } = await insforge.database
        .from('scores')
        .select()
        .eq('session_id', session_id);

    if (existingScores && existingScores.length > 0) {
        return res.status(409).json({ error: 'Session already scored' });
    }

    const evaluated = computeScore(components || {}, penalty, gates);

    const { data: savedScore, error: scoreSaveError } = await insforge.database
        .from('scores')
        .insert([{
            session_id,
            user_id: user.id,
            ...evaluated
        }])
        .select();

    if (scoreSaveError) {
        return res.status(500).json({ error: 'Failed to record score: ' + scoreSaveError.message });
    }

    const scoreId = savedScore[0].id;

    if (Array.isArray(score_items) && score_items.length > 0) {
        const itemsToInsert = score_items.map(item => ({
            ...item,
            score_id: scoreId
        }));
        await insforge.database.from('score_items').insert(itemsToInsert);
    }

    await insforge.database
        .from('sessions')
        .update({ status: 'completed', ended_at: new Date().toISOString() })
        .eq('id', session_id);

    return res.status(200).json({
        score_id: scoreId,
        s_final: evaluated.s_final,
        gates: evaluated.gates
    });
}
