import { z } from "zod";
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
const MIN = 10;
const MAX = 50;
const input_constraint = z
  .string()
  .min(MIN, {
    message: `At least ${MIN} characters expected`,
  })
  .max(MAX, {
    message: `At most ${MAX} characters expected`,
  });

const password_constraint = input_constraint.regex(passwordRegex, {
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
} );

export type LogIn = z.infer<typeof logInSchema>;

export type Register = z.infer<typeof registerSchema>;

export type FormType = "login" | "register";

export const responseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  user: z.object( {
    id: z.union([z.string(), z.number()]),
    username: z.string(),
    email: z.email()
  })
} );

export type ResponseSchemaType = z.infer<typeof responseSchema>

// {
//   "access_token": "string",
//   "token_type": "string",
//   "user": {
//     "username": "string",
//     "email": "user@example.com"
//   }
// }

export type GettingStartedState = {
  formType: FormType;
  setFormType: (type: FormType) => void;
};
