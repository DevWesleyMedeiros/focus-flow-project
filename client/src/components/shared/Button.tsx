// TODO: Implementar botão reutilizável do design system
"use client";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  type: "button" | "submit";
  disabled: boolean;
};

export function Button({
  children,
  onClick,
  variant = "primary",
  type,
  disabled,
}: Readonly<ButtonProps>) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`btn btn-${variant}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
