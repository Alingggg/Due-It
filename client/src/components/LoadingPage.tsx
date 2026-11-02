import { Loader2 } from "lucide-react";

interface LoadingPageProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

function LoadingPage({
  message = "Loading...",
  size = "md",
  fullScreen = true,
}: LoadingPageProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const containerClass = fullScreen
    ? "min-h-screen flex items-center justify-center bg-wash"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Loader2
            className={`${sizeClasses[size]} text-blue-600 animate-spin`}
          />
        </div>
        <p className="text-slate-600 text-sm sm:text-base">{message}</p>
      </div>
    </div>
  );
}

export default LoadingPage;
