import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Option = { label: string; value: string | number };

interface SelectFieldProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
}

export function SelectField({
  control,
  name,
  label,
  placeholder,
  options,
  required = false,
  disabled = false,
}: SelectFieldProps) {
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
