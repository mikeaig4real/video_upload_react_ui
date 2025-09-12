import { LogInForm } from "@/components/LogInForm";
import { RegisterForm } from "@/components/RegisterForm";
import { CardWrapper } from "@/components/CardWrapper";
import { useStore } from "@/store/useStore";
import * as API from "@/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import type {
  FormType,
  LogIn,
  Register,
  ResponseSchemaType,
} from "@shared/types/getting_started";
import { notify } from "@/utils/notify";
import { useAuthStore } from "@/store/useAuthStore";

const GetStarted = () => {
  const { formType, setFormType } = useStore();
  const {  setUser, setToken } = useAuthStore();
  const navigator = useNavigate();
  const onSuccess = (type: FormType) => {
    return ({ user, access_token }: ResponseSchemaType) => {
      setUser(user);
      setToken(access_token);
      setTimeout(() => {
        navigator("/dashboard");
      }, 2000);
      return `${
        type === "register" ? "Registration" : "Logging in"
      } successful`;
    };
  };
  function handleRegisterSubmit(values: object) {
    const assertValues = values as Register;
    notify(API.AuthAPI.register(assertValues), {
      success: onSuccess("register"),
      loading: "Registering...",
      error: "Registration Failed.",
    });
  }
  function handleLogInSubmit(values: object) {
    const assertValues = values as LogIn;
    notify(API.AuthAPI.login(assertValues), {
      success: onSuccess("login"),
      loading: "Logging in...",
      error: "Login Failed.",
    });
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <CardWrapper
          cardTitle={`${formType}`}
          cardDescription={`...to ${
            formType === "login" ? "Continue" : "Start"
          } your journey`}
          className="bg-transparent"
        >
          {formType === "register" ? (
            <RegisterForm handleSubmit={handleRegisterSubmit} />
          ) : (
            <LogInForm handleSubmit={handleLogInSubmit} />
          )}
        </CardWrapper>
      </div>
      <Button
        variant="ghost"
        type="button"
        className="cursor-pointer"
        onClick={() => setFormType(formType === "login" ? "register" : "login")}
      >
        {formType === "login"
          ? "Need an account ? Sign Up"
          : "Already have an account ? Login"}
      </Button>
    </div>
  );
};

export default GetStarted;
