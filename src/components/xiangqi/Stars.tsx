interface StarsProps {
  count: number;          // 0..3 (0 = neabsolvováno)
  size?: number;
  ariaLabel?: string;
}

export function Stars({ count, size = 18, ariaLabel }: StarsProps) {
  return (
    <span
      aria-label={ariaLabel ?? `${count} z 3 hvězdiček`}
      style={{ display: "inline-flex", gap: 2, alignItems: "center" }}
    >
      {[0, 1, 2].map((i) => {
        const filled = i < count;
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              d="M12 2.5 L14.6 9 L21.5 9.6 L16.3 14.1 L17.9 21 L12 17.4 L6.1 21 L7.7 14.1 L2.5 9.6 L9.4 9 Z"
              fill={filled ? "#d9a441" : "transparent"}
              stroke={filled ? "#a37320" : "#5e4a32"}
              strokeWidth={1.4}
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </span>
  );
}
