import { LoginResponse } from './storage';
export declare const auth: {
    login: (username: string, password: string) => LoginResponse;
    verificarToken: (token: string) => any;
    logout: (token: string) => void;
};