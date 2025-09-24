import { LogInForm } from "@/components/LogInForm";
import { RegisterForm } from "@/components/RegisterForm";
import { CardWrapper } from "@/components/CardWrapper";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import type { FormType, LogIn, Register } from "@shared/types/getting_started";
import { notify } from "@/utils/notify";
import { useFormStore } from "@/store/useFormStore";
import { useLogin, useRegister } from "@/hooks/query/useAuth";

const GetStarted = () => {
  const { formType, setFormType } = useFormStore();
  const navigator = useNavigate();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const onSuccess = (type: FormType) => {
    return () => {
      navigator("/dashboard");
      return `${
        type === "register" ? "Registration" : "Logging in"
      } successful`;
    };
  };
  function handleRegisterSubmit(values: object) {
    const assertValues = values as Register;
    notify(registerMutation.mutateAsync(assertValues), {
      success: onSuccess("register"),
      loading: "Registering...",
      error: "Registration Failed.",
    });
  }
  function handleLogInSubmit(values: object) {
    const assertValues = values as LogIn;
    notify(loginMutation.mutateAsync(assertValues), {
      success: onSuccess("login"),
      loading: "Logging in...",
      error: "Login Failed.",
    });
  }
  const isPending =
    formType === "register"
      ? registerMutation.isPending
      : loginMutation.isPending;

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
            <RegisterForm
              handleSubmit={handleRegisterSubmit}
              submitBtnDisabled={registerMutation.isPending}
            />
          ) : (
            <LogInForm
              handleSubmit={handleLogInSubmit}
              submitBtnDisabled={loginMutation.isPending}
            />
          )}
        </CardWrapper>
      </div>
      <Button
        variant="ghost"
        type="button"
        className="cursor-pointer"
        onClick={() => setFormType(formType === "login" ? "register" : "login")}
        disabled={isPending}
      >
        {formType === "login"
          ? "Need an account ? Sign Up"
          : "Already have an account ? Login"}
      </Button>
    </div>
  );
};

export default GetStarted;
