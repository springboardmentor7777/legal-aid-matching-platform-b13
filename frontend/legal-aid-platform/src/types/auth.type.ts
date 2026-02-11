export type Role = 'ADMIN' | 'CITIZEN' | 'NGO' | 'LAWYER';

export interface SignupPayload{
    name: string;
    email: string;
    password: string;
    role:Role;
}


