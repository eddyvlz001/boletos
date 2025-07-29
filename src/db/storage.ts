import type { Cliente, Contrato, OrdenTrabajo, Rifa } from '../types';

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

class StorageAdapter {
  private getItem<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItem<T>(key: string, value: T[]): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Autenticación y Usuarios
  login(username: string, password: string): LoginResponse {
    const usuarios = this.getItem<Usuario>('usuarios');
    const usuario = usuarios.find(u => 
      u.username === username && 
      u.activo
    );

    if (!usuario) {
      return { 
        success: false, 
        mensaje: 'Usuario no encontrado o inactivo' 
      };
    }

    // En producción, aquí se verificaría el hash de la contraseña
    if (password !== 'admin123') {
      return { 
        success: false, 
        mensaje: 'Contraseña incorrecta' 
      };
    }

    const token = this.generateToken();
    usuario.ultimoAcceso = new Date();
    this.setItem('usuarios', usuarios);

    return {
      success: true,
      token,
      usuario: {
        id: usuario.id,
        username: usuario.username,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo
      }
    };
  }

  verificarToken(token: string): Usuario | null {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    return usuario;
  }

  logout(token: string): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Gestión de Usuarios
  getUsers(): Usuario[] {
    return this.getItem<Usuario>('usuarios');
  }

  createUser(userData: Partial<Usuario> & { password?: string }): Usuario {
    const usuarios = this.getUsers();
    const newUser: Usuario = {
      id: Date.now(),
      username: userData.username!,
      nombre: userData.nombre!,
      email: userData.email!,
      rol: userData.rol || 'usuario',
      activo: true
    };
    usuarios.push(newUser);
    this.setItem('usuarios', usuarios);
    return newUser;
  }

  updateUser(userData: Partial<Usuario> & { password?: string }): Usuario | null {
    const usuarios = this.getUsers();
    const index = usuarios.findIndex(u => u.id === userData.id || u.username === userData.username);
    if (index === -1) return null;

    const updatedUser = { ...usuarios[index], ...userData };
    usuarios[index] = updatedUser;
    this.setItem('usuarios', usuarios);
    return updatedUser;
  }

  // Clientes
  getClientes(): Cliente[] {
    return this.getItem<Cliente>('clientes');
  }

  saveCliente(cliente: Cliente): Cliente {
    const clientes = this.getClientes();
    const newCliente = {
      ...cliente,
      id: Date.now(),
      createdAt: new Date()
    };
    clientes.push(newCliente);
    this.setItem('clientes', clientes);
    return newCliente;
  }

  // Contratos
  getContratos(): Contrato[] {
    return this.getItem<Contrato>('contratos');
  }

  saveContrato(contrato: Contrato): Contrato {
    const contratos = this.getContratos();
    contratos.push(contrato);
    this.setItem('contratos', contratos);
    return contrato;
  }

  updateContrato(contrato: Contrato): Contrato | null {
    const contratos = this.getContratos();
    const index = contratos.findIndex(c => c.id === contrato.id);
    if (index === -1) return null;
    
    contratos[index] = contrato;
    this.setItem('contratos', contratos);
    return contrato;
  }

  // Órdenes de trabajo
  getOrdenes(): OrdenTrabajo[] {
    return this.getItem<OrdenTrabajo>('ordenes');
  }

  saveOrden(orden: OrdenTrabajo): OrdenTrabajo {
    const ordenes = this.getOrdenes();
    ordenes.push(orden);
    this.setItem('ordenes', ordenes);
    return orden;
  }

  updateOrden(orden: OrdenTrabajo): OrdenTrabajo | null {
    const ordenes = this.getOrdenes();
    const index = ordenes.findIndex(o => o.id === orden.id);
    if (index === -1) return null;
    
    ordenes[index] = orden;
    this.setItem('ordenes', ordenes);
    return orden;
  }

  // Rifas
  getRifas(): Rifa[] {
    return this.getItem<Rifa>('rifas');
  }

  saveRifa(rifa: Rifa): Rifa {
    const rifas = this.getRifas();
    rifas.push(rifa);
    this.setItem('rifas', rifas);
    return rifa;
  }

  // Inicialización
  init() {
    // Crear usuario admin por defecto si no existe
    const usuarios = this.getUsers();
    if (usuarios.length === 0) {
      this.createUser({
        username: 'admin',
        nombre: 'Administrador',
        email: 'admin@example.com',
        rol: 'admin',
        password: 'admin123'
      });
    }
  }
}

export const storage = new StorageAdapter();
storage.init(); // Inicializar el almacenamiento