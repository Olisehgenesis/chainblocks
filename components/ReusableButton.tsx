"use client";

import React from "react";

type ReusableButtonProps = {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  [key: string]: any; // Allow additional props for compatibility
};

export function ReusableButton({
  children,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
}: ReusableButtonProps) {
  // Check if this is a small button based on className
  const isSmall = className.includes('px-2') || className.includes('py-1') || className.includes('text-xs');
  const isExtraSmall = className.includes('px-1.5') || className.includes('py-0.5');
  const isFooterButton = className.includes('font-bold') && !className.includes('px-') && !className.includes('py-');
  
  const base = isExtraSmall
    ? "inline-flex items-center justify-center gap-0.5 px-1.5 py-0.5 rounded-sm font-medium border transition-all duration-100"
    : isSmall 
    ? "inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md font-medium border transition-all duration-100"
    : isFooterButton
    ? "inline-flex items-center justify-center gap-2 px-7 py-1.5 rounded-lg font-medium border-2 transition-all duration-100"
    : "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium border-2 transition-all duration-100";
    
  const width = fullWidth ? "w-full" : "";
  const enabled = isExtraSmall
    ? "text-black border-[#166534] bg-[#166534]/20 hover:bg-[#166534]/30 shadow-[0_1px_0_0_rgba(0,0,0,0.1)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.1)] active:shadow-[0_0px_0_0_rgba(0,0,0,0.1)] active:translate-y-[0.5px]"
    : isSmall
    ? "text-black border-[#166534] bg-[#166534]/20 hover:bg-[#166534]/30 shadow-[0_2px_0_0_rgba(0,0,0,0.15)] hover:shadow-[0_3px_0_0_rgba(0,0,0,0.15)] active:shadow-[0_1px_0_0_rgba(0,0,0,0.15)] active:translate-y-[1px]"
    : isFooterButton
    ? "text-black border-[#166534] bg-[#166534]/20 hover:bg-[#166534]/30 shadow-[0_3px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_0_rgba(0,0,0,0.2)] active:translate-y-[1.5px]"
    : "text-black border-[#166534] bg-[#166534]/20 hover:bg-[#166534]/30 shadow-[0_4px_0_0_rgba(0,0,0,0.25)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.25)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.25)] active:translate-y-[2px]";
    
  const disabledCls = isExtraSmall || isSmall || isFooterButton
    ? "text-[#166534]/60 border-[#166534]/40 bg-transparent cursor-not-allowed"
    : "text-[#166534]/60 border-[#166534]/40 bg-transparent cursor-not-allowed";
    
  const stateCls = disabled || isLoading ? disabledCls : enabled;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${width} ${base} ${stateCls} ${className}`}
    >
      {children}
    </button>
  );
}
