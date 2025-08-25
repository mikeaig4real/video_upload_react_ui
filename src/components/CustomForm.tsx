import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldValues } from "react-hook-form";
import { z, ZodType } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomButton from "@/components/CustomButton";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
export type SchemaType = ZodType<object, FieldValues>;
export type HandleSubmitType = ( values: z.infer<SchemaType> ) => void;
export type FormFieldsDefault = {
  label: string;
  description: string;
  placeholder: string;
  editable?: boolean;
  type?: "text" | "password" | "textarea" | "select" | "checkbox";
  options?: { label: string; value: string }[];
};
export function CustomForm({
  zodSchema,
  defaultValues,
  handleSubmit,
  formFields,
  buttons,
  onFormChange,
  children,
}: {
  zodSchema: SchemaType;
  defaultValues: object;
  children?: React.ReactNode;
  handleSubmit: HandleSubmitType;
  onFormChange?: (hasChanged: boolean) => void;
  formFields: ({
    name: keyof z.infer<SchemaType> | string | never;
  } & FormFieldsDefault)[];
  buttons: {
    label: string;
    onClick?: () => void;
    type: "button" | "submit" | "reset";
    variant?: "default" | "outline" | "ghost" | "link" | "destructive";
    formChangeTriggered: boolean;
  }[];
}) {
  const form = useForm<z.infer<SchemaType>>({
    resolver: zodResolver(zodSchema),
    defaultValues: defaultValues,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const subscription = form.watch((values) => {
      const changed = (
        Object.keys(defaultValues) as (keyof z.infer<SchemaType>)[]
      ).some((key) => values[key] !== defaultValues[key]);
      setHasChanges(changed);
      if (onFormChange) onFormChange(changed);
    });
    return () => subscription.unsubscribe();
  }, [form, defaultValues, onFormChange]);

  function onSubmit(values: z.infer<SchemaType>) {
    handleSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {formFields.map(
          (
            {
              name,
              label,
              description,
              placeholder,
              editable = true,
              type = "text",
              options = [],
            },
            index
          ) => {
            return (
              <FormField
                key={`field-${label}-${index}`}
                control={form.control}
                name={name as keyof z.infer<SchemaType>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{label}</FormLabel>
                    <FormControl>
                      {editable ? (
                        <div>
                          {type === "textarea" && (
                            <Textarea
                              {...field}
                              placeholder={placeholder}
                              className="w-full"
                            />
                          )}

                          {type === "select" && (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={`Select ${label}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {options?.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {type === "checkbox" && (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                          {!type || type === "text" || type === "password" ? (
                            <Input
                              placeholder={placeholder}
                              type={
                                type ??
                                (["password", "confirm"].includes(name)
                                  ? "password"
                                  : "text")
                              }
                              {...field}
                            />
                          ) : null}
                        </div>
                      ) : (
                        <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground dark:bg-transparent">
                          {String(field.value ?? "")}
                        </div>
                      )}
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }
        )}
        <div className="flex justify-end gap-2">
          {buttons?.map((button, index) => {
            if (button.formChangeTriggered) {
              if (hasChanges) {
                return (
                  <CustomButton
                    key={`button-${index}`}
                    type={button.type}
                    onClick={button.onClick}
                    variant={button.variant!}
                  >
                    {button.label}
                  </CustomButton>
                );
              } else {
                return null;
              }
            } else {
              return (
                <CustomButton
                  key={`button-${index}`}
                  type={button.type}
                  onClick={button.onClick}
                  variant={button.variant!}
                >
                  {button.label}
                </CustomButton>
              );
            }
          })}
        </div>
      </form>
      {children}
    </Form>
  );
}
