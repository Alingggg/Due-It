import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

type Option = { label: string; value: string | number };

export default function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  required = false,
  disabled = false,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {label && (
            <FormLabel className="text-slate-700 data-[error=true]:text-slate-700">
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Select
              value={field.value?.toString()}
              onValueChange={field.onChange}
            >
              <SelectTrigger disabled={disabled} className="w-full">
                <SelectValue
                  placeholder={
                    placeholder ?? (label ? `Select ${label}` : "Select")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
