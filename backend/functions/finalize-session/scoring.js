/**
 * Deterministic Scoring Logic (from R&D Specification & Data Model)
 * S_raw = 100 * (0.20*D + 0.20*C + 0.15*I + 0.20*R + 0.10*E + 0.10*B + 0.05*T)
 * S_final = clamp(S_raw - penalty, 0, 100), then apply safety gates.
 */

export const SCORING_WEIGHTS = {
    standard_v1: {
        D: 0.20, // Detection
        C: 0.20, // Classification
        I: 0.15, // Identification
        R: 0.20, // Rules of Engagement
        E: 0.10, // Execution
        B: 0.10, // Team / Coordination (Behavior)
        T: 0.05  // Timeliness
    }
};

export function computeScore(components, penalty = 0, gates = [], pack = 'standard_v1') {
    const weights = SCORING_WEIGHTS[pack] || SCORING_WEIGHTS.standard_v1;
    
    // Clamp component values between 0.0 and 1.0
    const D = Math.max(0, Math.min(1, components.D ?? 0));
    const C = Math.max(0, Math.min(1, components.C ?? 0));
    const I = Math.max(0, Math.min(1, components.I ?? 0));
    const R = Math.max(0, Math.min(1, components.R ?? 0));
    const E = Math.max(0, Math.min(1, components.E ?? 0));
    const B = Math.max(0, Math.min(1, components.B ?? 0));
    const T = Math.max(0, Math.min(1, components.T ?? 0));

    // Raw weighted score (0 to 100)
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

    // Apply penalties
    let s_final = Math.max(0, Math.min(100, s_raw - penalty));

    // Apply safety gates (e.g. effect without authority caps S_final at 40)
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
