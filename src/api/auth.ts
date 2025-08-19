import api from "@/utils/axios";
import type { LogIn, Register, ResponseSchemaType } from "@/types/getting-started";

export async function register ( registerParams: Register )
{
  const res = await api.post<ResponseSchemaType>("/auth/register", {
    ...registerParams,
  });
  return res.data;
}

export async function login(loginParams: LogIn) {
  const params = new URLSearchParams();
  params.append("username", loginParams.username);
  params.append("password", loginParams.password);
  params.append("grant_type", "password");
  params.append("scope", "");
  const res = await api.post<ResponseSchemaType>("/auth/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return res.data;
}

export async function logout() {
  await api.post("/auth/logout");
}
