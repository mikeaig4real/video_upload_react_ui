import { logInSchema, type LogIn } from "@shared/types/getting_started";
import {
  CustomForm,
  type FormFieldsDefault,
  type FormProps,
} from "@/components/CustomForm";

const formFields: ({
  name: keyof LogIn;
} & FormFieldsDefault)[] = [
  {
    name: "username",
    label: "email",
    placeholder: "sonic_fox@mkx.com",
    description: "your email address",
  },
  {
    name: "password",
    label: "password",
    placeholder: "**********",
    description: "your password",
    type: "password",
  },
];

const defaultValues = {
  username: "",
  password: "",
};

export function LogInForm({ handleSubmit, submitBtnDisabled }: FormProps) {
  return (
    <CustomForm
      handleSubmit={handleSubmit}
      zodSchema={logInSchema}
      defaultValues={defaultValues}
      formFields={formFields}
      buttons={[
        {
          label: "Submit",
          type: "submit" as const,
          formChangeTriggered: false,
          disabled: submitBtnDisabled,
        },
      ]}
    />
  );
}
