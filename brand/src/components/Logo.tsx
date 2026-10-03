type MarkProps = {
  className?: string;
  echo?: boolean;
  animated?: boolean;
  color?: string;
  echoFill?: string;
};

function Orbit({
  color = "currentColor",
  animated = false,
}: {
  color?: string;
  animated?: boolean;
}) {
  return (
    <g>
      <circle
        cx="40"
        cy="58"
        r="24"
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="72 28"
        transform="rotate(-38 40 58)"
      />
      <circle
        className={animated ? "hf-dot" : undefined}
        cx="88"
        cy="24"
        r="11"
        fill={color}
      />
    </g>
  );
}

export function Mark({
  className = "w-16 h-16",
  echo = true,
  animated = false,
  color = "#FF4A1C",
  echoFill = "#C6FF3D",
}: MarkProps) {
  return (
    <svg
      viewBox="0 0 112 100"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {echo && (
        <g className={animated ? "animate-echo" : undefined} transform="translate(8 -7)">
          <Orbit color={echoFill} />
        </g>
      )}
      <Orbit color={color} animated={animated} />
    </svg>
  );
}

export function Wordmark({
  className = "",
  mark = true,
}: {
  className?: string;
  mark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center font-display font-extrabold lowercase leading-none ${className}`}>
      <span>how</span>
      {mark ? (
        <Mark className="mx-[0.12em] h-[0.92em] w-[0.92em]" />
      ) : (
        <span className="inline-block w-[0.42em]" />
      )}
      <span>far</span>
    </span>
  );
}

export function AppIcon({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-void ${className}`}
      style={{ borderRadius: "22%" }}
    >
      <Mark className="absolute inset-[8%] h-[84%] w-[84%]" animated />
    </div>
  );
}

export function MarkMono({
  className = "w-16 h-16",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 112 100"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <Orbit color={color} />
    </svg>
  );
}
