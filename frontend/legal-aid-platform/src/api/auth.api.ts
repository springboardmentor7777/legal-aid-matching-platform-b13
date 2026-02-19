import api from "./axios";
import { type SignupPayload } from "../types/auth.type";
import { type SigninPayload } from "../types/auth.type";

//register end point
export const signup = async (payload: SignupPayload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

//login end point
// export const signin = async(payload: SigninPayload) => {
//   const {data} = await api.post("/auth/login", payload);
//   return data;
// };

export const signin = async (payload: SigninPayload): Promise<any> => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};
