<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Empresa {
  logo: string;
  qr: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  numeroSecuencial: number;
}

const mostrarFormulario = ref(false);
const empresa = ref<Empresa>({
  logo: '',
  qr: '',
  nombre: '',
  direccion: '',
  telefono: '',
  email: '',
  numeroSecuencial: 1
});

// Cargar información guardada
onMounted(() => {
  const empresaGuardada = localStorage.getItem('informacionEmpresa');
  if (empresaGuardada) {
    empresa.value = JSON.parse(empresaGuardada);
  }
});

const editarInformacion = () => {
  mostrarFormulario.value = true;
};

const handleLogoChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        empresa.value.logo = e.target.result as string;
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const handleQrChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        empresa.value.qr = e.target.result as string;
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const guardarInformacion = () => {
  localStorage.setItem('informacionEmpresa', JSON.stringify(empresa.value));
  mostrarFormulario.value = false;
  empresa.value.numeroSecuencial++; // Incrementar el número secuencial para el siguiente contrato
};
</script>

<template>
  <div class="glass-section">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        Información de la Empresa
      </h2>
      <button 
        v-if="!mostrarFormulario"
        @click="editarInformacion"
        class="glass-button-primary"
      >
        Editar Información
      </button>
    </div>

    <template v-if="mostrarFormulario">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Logo y QR -->
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Logo de la Empresa</label>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div class="w-32 h-32 glass rounded-xl flex items-center justify-center overflow-hidden">
                <img v-if="empresa.logo" :src="empresa.logo" alt="Logo" class="max-w-full max-h-full object-contain">
                <span v-else class="text-gray-400">Sin logo</span>
              </div>
              <input 
                type="file" 
                accept="image/*"
                @change="handleLogoChange"
                class="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      transition-all duration-200"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Código QR</label>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div class="w-32 h-32 glass rounded-xl flex items-center justify-center overflow-hidden">
                <img v-if="empresa.qr" :src="empresa.qr" alt="QR" class="max-w-full max-h-full object-contain">
                <span v-else class="text-gray-400">Sin QR</span>
              </div>
              <input 
                type="file" 
                accept="image/*"
                @change="handleQrChange"
                class="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      transition-all duration-200"
              >
            </div>
          </div>
        </div>

        <!-- Información de contacto -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa</label>
            <input 
              v-model="empresa.nombre"
              type="text"
              class="glass-input w-full"
              placeholder="Nombre de la empresa"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input 
              v-model="empresa.direccion"
              type="text"
              class="glass-input w-full"
              placeholder="Dirección completa"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <input 
              v-model="empresa.telefono"
              type="tel"
              class="glass-input w-full"
              placeholder="Teléfono de contacto"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              v-model="empresa.email"
              type="email"
              class="glass-input w-full"
              placeholder="correo@empresa.com"
            >
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-end">
        <button 
          @click="guardarInformacion"
          class="glass-button-success"
        >
          Guardar Información
        </button>
      </div>
    </template>

    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Visualización de Logo y QR -->
        <div class="flex flex-wrap gap-6">
          <div v-if="empresa.logo" class="w-32 h-32 glass rounded-xl flex items-center justify-center p-2">
            <img :src="empresa.logo" alt="Logo" class="max-w-full max-h-full object-contain">
          </div>
          <div v-if="empresa.qr" class="w-32 h-32 glass rounded-xl flex items-center justify-center p-2">
            <img :src="empresa.qr" alt="QR" class="max-w-full max-h-full object-contain">
          </div>
        </div>

        <!-- Visualización de información -->
        <div class="glass rounded-xl p-6 space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Contrato #:</span>
            <span class="font-medium text-blue-600">{{ empresa.numeroSecuencial }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Empresa:</span>
            <span class="font-medium">{{ empresa.nombre }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Dirección:</span>
            <span class="font-medium">{{ empresa.direccion }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Teléfono:</span>
            <span class="font-medium">{{ empresa.telefono }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Email:</span>
            <span class="font-medium">{{ empresa.email }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>