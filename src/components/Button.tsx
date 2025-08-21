interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
  disabled?: boolean;
}

const baseStyles =
  "px-4 py-2 rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
  outline:
    "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50",
};

function Button({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
