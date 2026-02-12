export type Role = 'CITIZEN' | 'NGO' | 'LAWYER';

export interface SignupPayload{
    // name: string;
    email: string;
    password: string;
    role:Role;
}

export interface SigninPayload{
    userId: number;
    role: Role;
    exp: number;
}

