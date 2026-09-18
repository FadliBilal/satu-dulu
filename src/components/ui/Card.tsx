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
    default: "bg-white dark:bg-slate-900/90 border border-gray-200/80 dark:border-slate-800 shadow-sm text-slate-900 dark:text-slate-100",
    subtle: "bg-satubg-subtle/70 dark:bg-slate-900/50 border border-gray-200/50 dark:border-slate-800/80 text-slate-800 dark:text-slate-200",
    active: "bg-white dark:bg-slate-900 border-2 border-satutext-primary dark:border-satublue-500 shadow-sm text-slate-900 dark:text-slate-100",
    completed: "bg-gray-50/60 dark:bg-slate-900/40 border border-gray-200/40 dark:border-slate-800/60 text-satutext-secondary dark:text-slate-400",
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
