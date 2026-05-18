import type { ButtonHTMLAttributes, ReactNode } from "react";

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  ghost?: boolean;
  square?: boolean;
  children: ReactNode;
}

export function Pill({
  active,
  ghost,
  square,
  className = "",
  children,
  ...rest
}: PillProps) {
  const classes = [
    "pill",
    active ? "is-active" : "",
    ghost ? "is-ghost" : "",
    square ? "is-square" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
