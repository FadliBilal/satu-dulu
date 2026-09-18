"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className, id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={clsx(
            "w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-satublue-500/20 focus:border-satublue-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-all",
            error && "border-rose-300 dark:border-rose-900/60 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error ? (
          <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1.5">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
