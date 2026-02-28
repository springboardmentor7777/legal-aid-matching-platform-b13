import type { SigninPayload } from "../types/auth.type";
import api from "./axios";
// import { type SigninPayload } from "../types/auth.type";


export interface AdminSigninPayload{
    username: string;
}
//login end point
export const adminsignin = async(payload: SigninPayload) => {
  const {data} = await api.post("/admin",payload);
  return data;
};