import { cn } from "@/lib";

const FALLBACK = "Something went wrong. Please try again.";

function FormError({
  error,
  className,
}: {
  error: Error | null | undefined;
  className?: string;
}) {
  if (!error) return null;

  return (
    <p
      role="alert"
      className={cn("text-sm text-red-600 whitespace-pre-line", className)}
    >
      {error.message || FALLBACK}
    </p>
  );
}

export default FormError;
