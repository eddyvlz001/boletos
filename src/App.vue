```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isLoginPage = computed(() => route.name === 'login');
const usuarioActual = ref(JSON.parse(localStorage.getItem('usuario') || '{}'));
const isAdmin = computed(() => usuarioActual.value.rol === 'admin');

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  router.push('/login');
};

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};
</script>

<template>
  <div v-if="!isLoginPage" class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <header class="glass-section">
        <div class="flex justify-between items-center">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Sistema de Contratos
          </h1>
          <div class="flex gap-4">
            <button 
              @click="navigateTo('dashboard')"
              class="glass-button"
              :class="{ 'bg-blue-500 text-white': route.name === 'dashboard' }"
            >
              Dashboard
            </button>
            <button 
              @click="navigateTo('nuevo-contrato')"
              class="glass-button"
              :class="{ 'bg-blue-500 text-white': route.name === 'nuevo-contrato' }"
            >
              Nuevo Contrato
            </button>
            <button 
              @click="navigateTo('orden-trabajo')"
              class="glass-button"
              :class="{ 'bg-blue-500 text-white': route.name === 'orden-trabajo' }"
            >
              Orden de Trabajo
            </button>
            <button 
              @click="navigateTo('nueva-rifa')"
              class="glass-button"
              :class="{ 'bg-blue-500 text-white': route.name === 'nueva-rifa' }"
            >
              Nueva Rifa
            </button>
            <button 
              @click="navigateTo('empresa')"
              class="glass-button"
              :class="{ 'bg-blue-500 text-white': route.name === 'empresa' }"
            >
              Información Empresa
            </button>
            <button 
              v-if="isAdmin"
              @click="navigateTo('usuarios')"
              class="glass-button"
              :class="{ 'bg-blue-500 text-white': route.name === 'usuarios' }"
            >
              Gestión Usuarios
            </button>
            <button 
              v-if="isAdmin"
              @click="navigateTo('versiones')"
              class="glass-button"
              :class="{ 'bg-blue-500 text-white': route.name === 'versiones' }"
            >
              Versiones
            </button>
            <button 
              @click="logout"
              class="glass-button bg-red-500 text-white hover:bg-red-600"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main class="mt-8">
        <router-view></router-view>
      </main>
    </div>
  </div>
  <router-view v-else></router-view>
</template>
```