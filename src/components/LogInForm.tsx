import { logInSchema, type LogIn } from "@/types/getting_started";
import { CustomForm, type FormFieldsDefault, type HandleSubmitType } from "@/components/CustomForm";

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

export function LogInForm({
  handleSubmit,
}: {
  handleSubmit: HandleSubmitType;
}) {
  return (
    <CustomForm
      handleSubmit={handleSubmit}
      zodSchema={logInSchema}
      defaultValues={defaultValues}
      formFields={ formFields }
      buttons={
        [
          {
            label: "Submit",
            type: "submit" as const,
            formChangeTriggered: false
          }
        ]
      }
    />
  );
}
