<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storage } from '../db/storage';

interface User {
  id: number;
  username: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario';
  activo: boolean;
}

interface NewUser {
  username: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario';
  password?: string;
}

const users = ref<User[]>([]);
const editingUser = ref<User | null>(null);
const confirmPassword = ref('');

const newUser = ref<NewUser>({
  username: '',
  nombre: '',
  email: '',
  rol: 'usuario',
  password: ''
});

onMounted(() => {
  loadUsers();
});

const loadUsers = () => {
  users.value = storage.getUsers();
};

const handleSubmit = () => {
  if (newUser.value.password !== confirmPassword.value) {
    alert('Las contraseñas no coinciden');
    return;
  }

  if (editingUser.value) {
    storage.updateUser({
      ...editingUser.value,
      nombre: newUser.value.nombre,
      email: newUser.value.email,
      rol: newUser.value.rol,
      ...(newUser.value.password ? { password: newUser.value.password } : {})
    });
  } else {
    storage.createUser(newUser.value);
  }

  loadUsers();
  resetForm();
};

const editUser = (user: User) => {
  editingUser.value = user;
  newUser.value = {
    username: user.username,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol
  };
  confirmPassword.value = '';
};

const toggleUserStatus = (user: User) => {
  if (user.username === 'admin' && user.activo) {
    alert('No se puede desactivar al usuario administrador principal');
    return;
  }

  storage.updateUser({
    ...user,
    activo: !user.activo
  });
  loadUsers();
};

const resetForm = () => {
  editingUser.value = null;
  newUser.value = {
    username: '',
    nombre: '',
    email: '',
    rol: 'usuario',
    password: ''
  };
  confirmPassword.value = '';
};
</script>

<template>
  <div class="glass-section">
    <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
      Gestión de Usuarios
    </h2>

    <!-- Formulario de Nuevo Usuario -->
    <div class="glass rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">{{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
            <input 
              v-model="newUser.username"
              type="text"
              class="glass-input w-full"
              required
              :disabled="editingUser"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input 
              v-model="newUser.nombre"
              type="text"
              class="glass-input w-full"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              v-model="newUser.email"
              type="email"
              class="glass-input w-full"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select 
              v-model="newUser.rol"
              class="glass-input w-full"
              required
            >
              <option value="admin">Administrador</option>
              <option value="usuario">Usuario</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              v-model="newUser.password"
              type="password"
              class="glass-input w-full"
              :required="!editingUser"
              :placeholder="editingUser ? 'Dejar en blanco para mantener la actual' : ''"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
            <input 
              v-model="confirmPassword"
              type="password"
              class="glass-input w-full"
              :required="!editingUser"
            >
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <button 
            type="button"
            @click="resetForm"
            class="glass-button"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="glass-button-primary"
          >
            {{ editingUser ? 'Actualizar Usuario' : 'Crear Usuario' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de Usuarios -->
    <div class="glass rounded-xl p-6">
      <h3 class="text-xl font-semibold mb-4">Usuarios</h3>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">{{ user.username }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.nombre }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  user.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                ]">
                  {{ user.rol === 'admin' ? 'Administrador' : 'Usuario' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ user.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button 
                  @click="editUser(user)"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Editar
                </button>
                <button 
                  @click="toggleUserStatus(user)"
                  :class="user.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                >
                  {{ user.activo ? 'Desactivar' : 'Activar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>