import {
  FORM_INPUT_MAX,
  FORM_INPUT_MIN,
  PASSWORD_REGEX,
} from "../assets/constants";
import { z } from "zod";
import { userSchema } from "../types/user";

const input_constraint = z
  .string()
  .min(FORM_INPUT_MIN, {
    message: `At least ${FORM_INPUT_MIN} characters expected`,
  })
  .max(FORM_INPUT_MAX, {
    message: `At most ${FORM_INPUT_MAX} characters expected`,
  });

const password_constraint = input_constraint.regex(PASSWORD_REGEX, {
  message: "😠 👆 (Don't like to repeat)",
});
export const registerSchema = z
  .object({
    username: input_constraint,
    password: password_constraint,
    email: z.email(),
    confirm: password_constraint,
  })
  .refine(
    (data) => {
      return data.password === data.confirm;
    },
    {
      message: "Passwords do not match",
      path: ["confirm"],
    }
  );

export const logInSchema = z.object({
  username: z.email(),
  password: password_constraint,
});

export type LogIn = z.infer<typeof logInSchema>;

export type Register = z.infer<typeof registerSchema>;

export type FormType = "login" | "register";

export const responseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  user: userSchema,
});

export type ResponseSchemaType = z.infer<typeof responseSchema>;

export type GettingStartedState = {
  formType: FormType;
  setFormType: (type: FormType) => void;
};
