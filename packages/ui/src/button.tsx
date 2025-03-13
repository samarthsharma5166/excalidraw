"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
  onclick: () => void;  
}

export const Button = ({ children, className, appName, onclick }: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={onclick}
    >
      {children}
    </button>
  );
};
