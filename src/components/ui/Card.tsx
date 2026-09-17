import React from "react";
import clsx from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "active" | "completed";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
  ...props
}) => {
  const variantStyles = {
    default: "bg-white border border-gray-200/80 shadow-sm",
    subtle: "bg-satubg-subtle/70 border border-gray-200/50",
    active: "bg-white border-2 border-satutext-primary shadow-sm",
    completed: "bg-gray-50/60 border border-gray-200/40 text-satutext-secondary",
  };

  return (
    <div
      className={clsx("rounded-xl p-5 transition-all", variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};
