"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightAction, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              "w-full rounded-xl border text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-satublue-500/20 focus:border-satublue-600 py-2.5",
              leftIcon ? "pl-10" : "pl-3.5",
              rightAction ? "pr-10" : "pr-3.5",
              error
                ? "border-rose-300 dark:border-rose-900/60 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-200 dark:border-slate-800",
              className
            )}
            {...props}
          />
          {rightAction && (
            <div className="absolute right-3.5 flex items-center">
              {rightAction}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1.5">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
