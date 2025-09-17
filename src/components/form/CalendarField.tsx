"use client";

import { useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface CalendarFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function CalendarField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder = "Select date",
  required = false,
  disabled = false,
}: CalendarFieldProps<TFieldValues, TName>) {
  const [open, setOpen] = useState(false);

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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal border-slate-300 text-black hover:bg-slate-100 hover:text-black focus-visible:ring-slate-200 focus-visible:border-slate-400"
                  disabled={disabled}
                >
                  {field.value ? format(field.value, "P") : placeholder}
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={field.value}
                captionLayout="dropdown"
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false);
                }}
                disabled={disabled}
              />
            </PopoverContent>
          </Popover>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
