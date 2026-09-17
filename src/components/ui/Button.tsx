import React from "react";
import clsx from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "blue" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variantStyles = {
      primary:
        "bg-slate-900 text-white hover:bg-satublue-900 active:bg-slate-950 focus:ring-slate-900 shadow-xs",
      blue:
        "bg-satublue-600 text-white hover:bg-satublue-700 active:bg-satublue-800 focus:ring-satublue-600 shadow-xs",
      secondary:
        "bg-satublue-50 text-satublue-900 border border-satublue-200/80 hover:bg-satublue-100 active:bg-satublue-200 focus:ring-satublue-500",
      outline:
        "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus:ring-satublue-500",
      ghost:
        "text-slate-600 hover:text-satublue-700 hover:bg-satublue-50/70 focus:ring-satublue-500",
      danger:
        "bg-satudanger text-white hover:bg-red-700 active:bg-red-800 focus:ring-satudanger",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-xs sm:text-sm px-4 py-2.5 gap-2",
      lg: "text-sm sm:text-base px-6 py-3 gap-2.5 font-medium tracking-tight",
    };

    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
