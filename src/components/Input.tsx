"use client";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps {
  type?: string;
  id?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

function Input({
  type = "text",
  id,
  className = "",
  placeholder,
  disabled = false,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="relative w-full">
      <input
        type={inputType}
        placeholder={placeholder}
        disabled={disabled}
        {...rest}
        className={`w-full px-3 py-2 text-sm md:px-4 md:py-3 md:text-base border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 ${
          isPassword ? "pr-12" : ""
        } ${className}`}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600 transition-colors duration-200 p-1"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      )}
    </div>
  );
}

export default Input;
