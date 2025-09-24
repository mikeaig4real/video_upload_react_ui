import { useMutation } from "@tanstack/react-query";
import { AuthAPI } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  LogIn,
  Register,
  ResponseSchemaType,
} from "@shared/types/getting_started";

export function useRegister() {
  const { setUser, setToken } = useAuthStore();

  return useMutation<ResponseSchemaType, Error, Register>({
    mutationFn: AuthAPI.register,
    onSuccess: ({ user, access_token }) => {
      setUser(user);
      setToken(access_token);
    },
  });
}

export function useLogin() {
  const { setUser, setToken } = useAuthStore();

  return useMutation<ResponseSchemaType, Error, LogIn>({
    mutationFn: AuthAPI.login,
    onSuccess: ({ user, access_token }) => {
      setUser(user);
      setToken(access_token);
    },
  });
}

export function useLogout() {
  const { logOut } = useAuthStore();

  return useMutation<void, Error, void>({
    mutationFn: AuthAPI.logout,
    onSuccess: () => {
      logOut();
    },
  });
}
