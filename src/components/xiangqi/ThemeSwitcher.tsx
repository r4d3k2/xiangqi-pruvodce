import { applyTheme, saveTheme, type ThemeId } from "../../lib/storage";

interface ThemeOption {
  id: ThemeId;
  label: string;
  icon: string;
}

const THEMES: ThemeOption[] = [
  { id: "wooden-night", label: "Wooden Night", icon: "🌙" },
  { id: "wooden-day", label: "Wooden Day", icon: "☀️" },
  { id: "modern-light", label: "Modern Light", icon: "⚪" },
  { id: "midnight-blue", label: "Midnight Blue", icon: "🌃" },
];

interface ThemeSwitcherProps {
  theme: ThemeId;
  onChange: (t: ThemeId) => void;
}

export function ThemeSwitcher({ theme, onChange }: ThemeSwitcherProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 4,
        padding: 4,
        background: "var(--surface)",
        border: "1px solid var(--border-soft)",
        borderRadius: 999,
      }}
      role="group"
      aria-label="Volba tématu"
    >
      {THEMES.map((t) => {
        const active = t.id === theme;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              applyTheme(t.id);
              saveTheme(t.id);
              onChange(t.id);
            }}
            title={t.label}
            aria-label={t.label}
            aria-pressed={active}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: active
                ? "1px solid var(--accent-border)"
                : "1px solid transparent",
              background: active ? "var(--accent-bg)" : "transparent",
              fontSize: 14,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              transition: "background 0.18s ease, border-color 0.18s ease",
            }}
          >
            <span aria-hidden>{t.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
