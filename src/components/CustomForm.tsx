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
export type SchemaType = ZodType<object, FieldValues>
export type HandleSubmitType = (values: z.infer<SchemaType>) => void
export function CustomForm({
  zodSchema,
  defaultValues,
  handleSubmit,
  formFields,
}: {
  zodSchema: SchemaType;
  defaultValues: object;
  handleSubmit: HandleSubmitType;
  formFields: {
    name: keyof z.infer<SchemaType> | string | never;
    label: string;
    description: string;
    placeholder: string;
  }[];
}) {
  const form = useForm<z.infer<SchemaType>>({
    resolver: zodResolver(zodSchema),
    defaultValues: defaultValues,
  });

  function onSubmit(values: z.infer<SchemaType>) {
    handleSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {formFields.map(({ name, label, description, placeholder }, index) => {
          return (
            <FormField
              key={`field-${label}-${index}`}
              control={form.control}
              name={name as keyof z.infer<SchemaType>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={placeholder}
                      type={
                        ["password", "confirm"].includes(name)
                          ? "password"
                          : "text"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <CustomButton type="submit">Submit</CustomButton>
      </form>
    </Form>
  );
}
