# Triagr Backend — Simulation Seam

Purpose: define exactly what the future simulation (in `/simulation`) will exchange with the rest of the system, so it can be added later without schema or UI changes. The frontend mirrors these types in its `domain/` folder. Keep both in sync.

## Principles (from the R&D report)
- Deterministic: same seed + same content versions + same inputs gives the same event sequence.
- Fixed tick is authoritative for time, not wall clock.
- Ground truth never reaches the trainee UI. Events carry a `visibility` flag.
- Everything is an event; scoring is a pure function of the event log.

## Event envelope
```json
{
  "session_id": "uuid",
  "tick": 7120,
  "seq": 3,
  "sim_time_s": 142.4,
  "source": "trainee | sim | system",
  "type": "track.update",
  "visibility": "trainee | instructor | truth",
  "payload": {}
}
```
Maps to the `events` table (`sim_time_s` can be derived from `tick`; store it inside `payload` or add a column in a later migration).

## Event types needed for the demo
| Type | Visibility | Payload (summary) |
|---|---|---|
| `track.init` | trainee | `track_id`, `position {x,y,z}`, `uncertainty_m`, `quality` |
| `track.update` | trainee | `track_id`, `position`, `speed_mps`, `heading_deg`, `class_probs`, `contradiction?` |
| `track.drop` | trainee | `track_id`, `reason` |
| `action.mark` / `action.classify` / `action.prioritise` / `action.warn` / `action.request_support` / `action.select_effect` | trainee | `track_id`, action fields (class, hostility, confidence 0..1, effect id), `evidence_refs[]` |
| `action.report` | trainee | `who, where, what, when, action_taken, requested_support` |
| `roe.authority_check` / `roe.violation` | trainee | `rule_id`, `result` |
| `effect.result` | trainee | `track_id`, `outcome: achieved | partial | failed | unknown` |
| `truth.entity` | truth | `track_id`, `true_class`, `true_hostility`, `position` (kept for scoring and review only) |
| `system.session_end` | system | `reason` |

## Trainee actions (frontend to simulation)
`{ type: 'mark' | 'classify' | 'prioritise' | 'warn' | 'request_support' | 'select_effect' | 'report', track_id?, ... }`

## Session summary (simulation to backend at end)
```json
{
  "session_id": "uuid",
  "log_hash": "sha256:...",
  "scoring_pack": "standard_v1",
  "components": {"D":0.67,"C":0.88,"I":0.85,"R":0.90,"E":0.78,"B":0.75,"T":0.70},
  "s_raw": 80.55, "penalty": 5, "s_final": 75.55,
  "gates": [],
  "items": [{"rule_id":"CLS-003","episode_id":"T15","event_time_s":142.4,
             "expected_branch":"fpv_hostile","selected_branch":"quad_benign",
             "points_raw":0.2,"points_weighted":0.4,"penalty":0,"coaching_tag":"RF_ABSENCE_NOT_BENIGN"}]
}
```
Maps directly onto `scores` and `score_items`.

## How the real simulation will connect later
1. Frontend creates a `sessions` row (as now) and opens a WebSocket to the simulation service with `session_id` and seed.
2. Simulation streams trainee-visible events to the client; client sends actions back.
3. Simulation (trusted, server-side credential) writes batched `events` and the final summary rows.
4. Change `sim_source` from `mock` to `engine`.

Needed backend changes at that time: a trusted write path that bypasses client-only RLS (service credential or edge function), and possibly a `sim_time_s` column. Plan these as new migrations; do not pre-build them now.

## Demo behaviour
The frontend's `MockSimulation` produces the same shapes, so the demo already exercises this contract. The backend must accept events and summary rows exactly in these formats.
