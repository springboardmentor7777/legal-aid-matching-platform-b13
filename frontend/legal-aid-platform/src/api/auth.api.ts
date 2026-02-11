import api from "./axios";
import { type SignupPayload } from "../types/auth.type";

export const signup = async (payload: SignupPayload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};
