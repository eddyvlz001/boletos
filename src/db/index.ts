import { storage } from './storage';

export const initDatabase = async () => {
  // No necesitamos inicializar nada para localStorage
  return Promise.resolve();
};

export default storage;