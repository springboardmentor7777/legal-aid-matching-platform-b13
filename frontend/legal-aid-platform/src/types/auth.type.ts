export type Role = 'CITIZEN' | 'NGO' | 'LAWYER';

export interface SignupPayload{
    // name: string;
    email: string;
    password: string;
    role:Role;
}

export interface SigninPayload{
    email: string;
    password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
  accessToken: string;
  refreshToken: string;
  role: Role;
  username: string;
}