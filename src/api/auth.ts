import api from "@/utils/axios";
import type { LogIn, Register, ResponseSchemaType } from "@/types/getting_started";
import { dummyUser } from "@/store/useStore";
import { API_BASE_URL } from "@/assets/constants";

export async function register ( registerParams: Register )
{
  if (!API_BASE_URL) return { success: true, message: "Registration simulated", data: dummyUser };
  const res = await api.post<ResponseSchemaType>("/auth/register", {
    ...registerParams,
  });
  return res.data;
}

export async function login ( loginParams: LogIn )
{
  if (!API_BASE_URL)
    return {
      success: true,
      message: "Registration simulated",
      data: dummyUser,
    };
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
