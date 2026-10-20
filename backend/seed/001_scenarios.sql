-- Block B4: Seed Scenarios (8 scenarios, 2 per family, generic training content)
-- Idempotent: ON CONFLICT (slug) DO UPDATE

INSERT INTO public.scenarios (
    id,
    slug,
    title,
    family,
    summary,
    learning_objectives,
    difficulty,
    time_limit_s,
    default_seed,
    config,
    version,
    is_active
) VALUES
-- 1. Family: bird_decoy_confusion (2 scenarios)
(
    '10000000-0000-0000-0000-000000000001',
    'bird-decoy-alpha',
    'Avian Flocking vs. Micro-UAS Decoy',
    'bird_decoy_confusion',
    'Differentiate benign migratory bird patterns from low-radar-cross-section micro drones exhibiting erratic micro-doppler signatures.',
    ARRAY[
        'Distinguish avian kinematics from fixed-wing micro-UAS flight vectors',
        'Verify RF spectrum absence before classifying radar anomalies',
        'Avoid premature kinetic engagement on benign fauna'
    ],
    0.25,
    180,
    1001,
    '{"threat_count": 2, "decoy_count": 6, "weather": "clear", "lighting": "daylight", "sensors": ["radar_3d", "optical_ptz", "rf_direction_finder"]}'::jsonb,
    '1.0.0',
    true
),
(
    '10000000-0000-0000-0000-000000000002',
    'bird-decoy-bravo',
    'Thermal Decoy Infiltration in Urban Canopy',
    'bird_decoy_confusion',
    'Evaluate roosting thermal signatures against hovering quadcopters cloaked in low-emissivity material along an urban perimeter.',
    ARRAY[
        'Correlate multi-spectral thermal imaging with acoustic cues',
        'Identify payload-induced thermal blooming on rotary drones',
        'Maintain positive target tracking amidst thermal clutter'
    ],
    0.55,
    240,
    1002,
    '{"threat_count": 3, "decoy_count": 8, "weather": "fog", "lighting": "dusk", "sensors": ["thermal_ir", "acoustic_array", "radar_3d"]}'::jsonb,
    '1.0.0',
    true
),

-- 2. Family: multi_axis_raid (2 scenarios)
(
    '20000000-0000-0000-0000-000000000001',
    'multi-axis-delta',
    'Converging Quadcopter Swarm on Perimeter',
    'multi_axis_raid',
    'Coordinate defense priorities against 4 simultaneous commercial quadcopters approaching from opposing cardinal quadrants.',
    ARRAY[
        'Prioritise incoming threats based on time-to-closest-point-of-approach (TCPA)',
        'Allocate electronic counter-measures sequentially without channel congestion',
        'Maintain perimeter situation report while engaging multi-axis tracks'
    ],
    0.65,
    240,
    2001,
    '{"threat_count": 4, "axes": 4, "weather": "windy", "lighting": "daylight", "sensors": ["radar_3d", "optical_ptz", "rf_jammer"]}'::jsonb,
    '1.0.0',
    true
),
(
    '20000000-0000-0000-0000-000000000002',
    'multi-axis-echo',
    'Coordinated Low-Altitude Saturation Raid',
    'multi_axis_raid',
    'Manage high-speed simultaneous multi-axis drone vectors exploiting terrain masking to overwhelm localized defense sensors.',
    ARRAY[
        'Detect terrain-masking pop-up vectors using elevated sensor nodes',
        'Execute rapid triage and handoff to kinetic mitigation systems',
        'Ensure comprehensive post-engagement battle damage assessment'
    ],
    0.80,
    300,
    2002,
    '{"threat_count": 6, "axes": 3, "weather": "turbulent", "lighting": "night", "sensors": ["radar_3d", "optical_ptz", "thermal_ir", "rf_jammer"]}'::jsonb,
    '1.0.0',
    true
),

-- 3. Family: report_only_authority (2 scenarios)
(
    '30000000-0000-0000-0000-000000000001',
    'report-only-golf',
    'VIP Transit Corridor Surveillance Only',
    'report_only_authority',
    'Monitor and report unauthorized recreational drone activity within a strict civilian buffer zone without engaging kinetic countermeasures.',
    ARRAY[
        'Observe and maintain continuous passive tracking of unauthorized drone',
        'Generate compliant tactical SALUTE reports to command authorities',
        'Adhere strictly to no-engagement rules of engagement (ROE)'
    ],
    0.30,
    200,
    3001,
    '{"threat_count": 1, "engagement_permitted": false, "weather": "clear", "lighting": "daylight", "sensors": ["optical_ptz", "rf_direction_finder"]}'::jsonb,
    '1.0.0',
    true
),
(
    '30000000-0000-0000-0000-000000000002',
    'report-only-hotel',
    'Foreign Diplomatic Airspace Incursion',
    'report_only_authority',
    'Observe suspected state-sponsored reconnaissance drone hovering along border airspace where active neutralization is forbidden.',
    ARRAY[
        'Document telemetry, payload type, and heading of intruding platform',
        'Transmit real-time tracking data to joint inter-agency liaison',
        'Verify legal ROE boundaries prior to any frequency mitigation'
    ],
    0.50,
    240,
    3002,
    '{"threat_count": 2, "engagement_permitted": false, "weather": "overcast", "lighting": "dusk", "sensors": ["radar_3d", "optical_ptz", "rf_scanner"]}'::jsonb,
    '1.0.0',
    true
),

-- 4. Family: rf_silent_infiltration (2 scenarios)
(
    '40000000-0000-0000-0000-000000000001',
    'rf-silent-kilo',
    'Autonomous Waypoint Glider Infiltration',
    'rf_silent_infiltration',
    'Detect and classify a pre-programmed composite fixed-wing glider navigating via inertial coordinates without RF transmitter emissions.',
    ARRAY[
        'Detect non-emitting gliders using acoustic Doppler and electro-optical sensors',
        'Differentiate glider aerodynamic glide slope from commercial sailplanes',
        'Classify payload carriage on zero-RF autonomous airframes'
    ],
    0.60,
    260,
    4001,
    '{"threat_count": 1, "rf_emission": false, "weather": "calm", "lighting": "overcast", "sensors": ["acoustic_array", "optical_ptz", "thermal_ir"]}'::jsonb,
    '1.0.0',
    true
),
(
    '40000000-0000-0000-0000-000000000002',
    'rf-silent-lima',
    'Dark Autonomous Swarm Night Penetration',
    'rf_silent_infiltration',
    'Triage multiple radio-silent tether-released mini-quads operating on optical flow navigation in complete darkness.',
    ARRAY[
        'Identify optical flow contrast signatures against nighttime background',
        'Correlate silent micro-acoustic rotor pulses with thermal heat blooms',
        'Track multi-target convergence without radar cross-section spikes'
    ],
    0.75,
    280,
    4002,
    '{"threat_count": 3, "rf_emission": false, "weather": "clear", "lighting": "night", "sensors": ["thermal_ir", "acoustic_array"]}'::jsonb,
    '1.0.0',
    true
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    family = EXCLUDED.family,
    summary = EXCLUDED.summary,
    learning_objectives = EXCLUDED.learning_objectives,
    difficulty = EXCLUDED.difficulty,
    time_limit_s = EXCLUDED.time_limit_s,
    default_seed = EXCLUDED.default_seed,
    config = EXCLUDED.config,
    version = EXCLUDED.version,
    is_active = EXCLUDED.is_active;
