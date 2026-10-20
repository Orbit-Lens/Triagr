import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
}

export function TriagrEmblem({ className = 'text-[#bcd877]', size = 120 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={(size * 78) / 120}
      viewBox="0 0 160 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Triagr Insignia"
    >
      {/* Tactical Wing Left - Layer 1 */}
      <path
        d="M60 38H18L26 44H60V38Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M60 47H10L20 53H60V47Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M60 56H4L14 62H60V56Z"
        fill="currentColor"
        opacity="0.7"
      />

      {/* Tactical Wing Right - Layer 1 */}
      <path
        d="M100 38H142L134 44H100V38Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M100 47H150L140 53H100V47Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M100 56H156L146 62H100V56Z"
        fill="currentColor"
        opacity="0.7"
      />

      {/* Central Shield Outline */}
      <path
        d="M80 12L105 32V64L80 94L55 64V32L80 12Z"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
        fill="transparent"
      />

      {/* Central Radar Target / Dagger Core */}
      <circle
        cx="80"
        cy="40"
        r="14"
        stroke="currentColor"
        strokeWidth="4"
        fill="transparent"
      />
      <circle
        cx="80"
        cy="40"
        r="6"
        fill="currentColor"
      />

      {/* Tactical Sensor Dagger Body */}
      <path
        d="M77 46H83V70L80 77L77 70V46Z"
        fill="currentColor"
      />

      {/* Inner Wing Chevron Accents */}
      <path
        d="M54 38L42 28H32L46 40H54V38Z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M106 38L118 28H128L114 40H106V38Z"
        fill="currentColor"
        opacity="0.95"
      />
    </svg>
  );
}
