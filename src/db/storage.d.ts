export interface Usuario {
    id: number;
    username: string;
    nombre: string;
    email: string;
    rol: 'admin' | 'usuario';
    activo: boolean;
    ultimoAcceso?: Date;
}

export interface LoginResponse {
    success: boolean;
    token?: string;
    usuario?: Usuario;
    mensaje?: string;
}

export declare const storage: {
    login: (username: string, password: string) => LoginResponse;
    verificarToken: (token: string) => Usuario | null;
    logout: (token: string) => void;
    getUsers: () => Usuario[];
    createUser: (userData: Partial<Usuario>) => Usuario;
    updateUser: (userData: Partial<Usuario>) => Usuario | null;
    init: () => void;
};