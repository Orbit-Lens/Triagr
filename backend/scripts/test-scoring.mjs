import { computeScore } from '../functions/finalize-session/scoring.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
    if (condition) {
        console.log(`[PASS] ${testName}`);
        passed++;
    } else {
        console.error(`[FAIL] ${testName}`);
        failed++;
    }
}

console.log('--- Testing Deterministic Scoring Logic ---');

// Test 1: Full score (1.0 across all components)
const full = computeScore({ D: 1, C: 1, I: 1, R: 1, E: 1, B: 1, T: 1 });
assert(full.s_raw === 100 && full.s_final === 100, 'All 1.0 components yield S_final = 100');

// Test 2: Standard fixture from PRD & R&D Report
// Weights: D:0.20, C:0.20, I:0.15, R:0.20, E:0.10, B:0.10, T:0.05
// Components: D:0.67, C:0.88, I:0.85, R:0.90, E:0.78, B:0.75, T:0.70
// S_raw = 100 * (0.2*0.67 + 0.2*0.88 + 0.15*0.85 + 0.2*0.90 + 0.1*0.78 + 0.1*0.75 + 0.05*0.70)
// = 100 * (0.134 + 0.176 + 0.1275 + 0.18 + 0.078 + 0.075 + 0.035) = 100 * 0.8055 = 80.55
const fixture = computeScore(
    { D: 0.67, C: 0.88, I: 0.85, R: 0.90, E: 0.78, B: 0.75, T: 0.70 },
    5.0 // penalty
);
assert(fixture.s_raw === 80.55, 'Fixture S_raw matches exact mathematical formula (80.55)');
assert(fixture.s_final === 75.55, 'Fixture S_final matches exact penalty subtraction (75.55)');

// Test 3: Safety Gate clamp (EFFECT_WITHOUT_AUTHORITY caps S at 40)
const gated = computeScore(
    { D: 1, C: 1, I: 1, R: 1, E: 1, B: 1, T: 1 },
    0,
    [{ code: 'EFFECT_WITHOUT_AUTHORITY' }]
);
assert(gated.s_final === 40, 'Safety gate EFFECT_WITHOUT_AUTHORITY caps score at 40');
assert(gated.gates.includes('EFFECT_WITHOUT_AUTHORITY'), 'Fired gates array contains EFFECT_WITHOUT_AUTHORITY');

// Test 4: Floor clamp (negative penalty cannot drive score below 0)
const floored = computeScore({ D: 0.1, C: 0.1 }, 50);
assert(floored.s_final === 0, 'S_final clamped at 0');

console.log(`\nUnit Test Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
