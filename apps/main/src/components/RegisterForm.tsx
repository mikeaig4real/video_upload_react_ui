import { registerSchema, type Register } from "@shared/types/getting_started";
import {
  CustomForm,
  type FormFieldsDefault,
  type HandleSubmitType,
} from "@/components/CustomForm";

const formFields: ({
  name: keyof Register;
} & FormFieldsDefault)[] = [
  {
    name: "username",
    label: "username",
    placeholder: "HelloKitty123",
    description: "your display name",
  },
  {
    name: "email",
    label: "email",
    placeholder: "sonic_fox@mkx.com",
    description: "your email address",
  },
  {
    name: "password",
    label: "password",
    placeholder: "**********",
    description: "at least 8, small + CAPS + digits + special characters",
    type: "password",
  },
  {
    name: "confirm",
    label: "confirm password",
    placeholder: "**********",
    description: "just the same as above 👆",
    type: "password",
  },
];

const defaultValues = {
  username: "",
  email: "",
  password: "",
  confirm: "",
};

export function RegisterForm({
  handleSubmit,
}: {
  handleSubmit: HandleSubmitType;
}) {
  return (
    <CustomForm
      handleSubmit={handleSubmit}
      zodSchema={registerSchema}
      defaultValues={defaultValues}
      formFields={formFields}
      buttons={[
        {
          label: "Submit",
          type: "submit" as const,
          formChangeTriggered: false,
        },
      ]}
    />
  );
}
