import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  ToggleGroup,
  ToggleGroupItem,
} from "@/components";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface ToggleGroupOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface ToggleGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  options: ToggleGroupOption[];
  type?: "single" | "multiple";
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline";
  required?: boolean;
  disabled?: boolean;
  className?: string;
  toggleItemClassName?: string;
}

function ToggleGroupField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  options,
  type = "single",
  size = "default",
  variant = "default",
  required = false,
  disabled = false,
  className,
  toggleItemClassName,
}: ToggleGroupFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className="text-slate-700 data-[error=true]:text-slate-700">
              {label}
              {required && (
                <span className="text-red-500" title="Required">
                  {" "}
                  *
                </span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <ToggleGroup
              type={type}
              value={field.value}
              onValueChange={field.onChange}
              size={size}
              variant={variant}
              disabled={disabled}
              className={className}
            >
              {options.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  aria-label={option.label}
                  className={`flex items-center ${toggleItemClassName || ""}`}
                >
                  {option.icon && <option.icon className="h-4 w-4" />}
                  <span className="text-xs">{option.label}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

export default ToggleGroupField;
