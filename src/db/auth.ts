import { storage } from './storage';

export const auth = {
  login: (username: string, password: string) => storage.login(username, password),
  verificarToken: (token: string) => storage.verificarToken(token),
  logout: (token: string) => storage.logout(token)
};