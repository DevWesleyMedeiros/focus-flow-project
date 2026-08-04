// TODO: Implementar botão reutilizável do design system
"use client";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  children,
  onClick,
  variant = "primary",
}: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
