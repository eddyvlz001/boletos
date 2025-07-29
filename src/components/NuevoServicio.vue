<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Servicio, Item, Personal } from '../types';

const emit = defineEmits(['servicio-creado']);

// Estado para items por tipo de servicio
const itemsPorServicio = ref<Record<string, string[]>>({
  fotografia: [
    'Sesión de fotos',
    'Video de la ceremonia',
    'Álbum digital',
    'Drone',
    'Fotografías impresas',
    'Video editado'
  ],
  dj: [
    'Equipo de sonido',
    'Luces LED',
    'Karaoke',
    'Máquina de humo',
    'Pantalla LED',
    'Micrófono inalámbrico'
  ],
  limosina: [
    'Decoración básica',
    'Champagne',
    'Hielo',
    'Agua embotellada',
    'Servicio de chofer'
  ],
  personal: [
    'Uniforme completo',
    'Kit de emergencia',
    'Radio comunicador',
    'Tabla portapapeles'
  ]
});

// Tipos de servicio predefinidos
const tiposServicio = [
  {
    id: 'fotografia',
    nombre: 'Fotografía y Video',
    icono: '📸'
  },
  {
    id: 'dj',
    nombre: 'Servicio de DJ',
    icono: '🎵'
  },
  {
    id: 'limosina',
    nombre: 'Servicio de Limosina',
    icono: '🚗'
  },
  {
    id: 'personal',
    nombre: 'Servicio de Personal',
    icono: '👥'
  }
];

// Estado para servicios
const servicioSeleccionado = ref('');
const servicioActual = computed(() => tiposServicio.find(s => s.id === servicioSeleccionado.value));

const nuevoServicio = ref<Partial<Servicio>>({
  nombre: '',
  descripcion: '',
  tipo: 'hora',
  duracion: 1,
  personal: [],
  items: []
});

// Estado para items
const nuevoItem = ref<Partial<Item>>({
  nombre: '',
  cantidad: 1,
  precioUnitario: 0
});

// Estado para nuevo item predefinido
const nuevoItemPredefinido = ref('');

// Estado para personal
const nuevoPersonal = ref<Partial<Personal>>({
  nombre: '',
  rol: ''
});

// Roles predefinidos para personal
const rolesBase = [
  'Mesero',
  'Capitán de meseros',
  'Hostess',
  'Bartender',
  'Personal de limpieza',
  'Coordinador de eventos',
  'Valet parking'
];

// Estado para roles personalizados
const rolesPersonalizados = ref<string[]>([]);
const nuevoRol = ref('');

// Limosinas predefinidas
const limosinasPredefinidas = ref([
  {
    id: crypto.randomUUID(),
    nombre: 'Limosina Stretch Blanca',
    capacidad: 10,
    descripcion: 'Limosina clásica en color blanco, ideal para bodas'
  },
  {
    id: crypto.randomUUID(),
    nombre: 'Limosina Hummer H2',
    capacidad: 16,
    descripcion: 'Limosina estilo SUV, perfecta para grupos grandes'
  },
  {
    id: crypto.randomUUID(),
    nombre: 'Limosina Lincoln Town Car',
    capacidad: 8,
    descripcion: 'Limosina ejecutiva, elegante y confortable'
  }
]);

// Estado para limosina seleccionada
const limosinaSeleccionada = ref('');
const horaInicio = ref('');
const duracionHoras = ref(1);

// Gestión de limosinas
const nuevaLimosina = ref({
  nombre: '',
  capacidad: 0
});

// Cargar datos guardados
onMounted(() => {
  const itemsGuardados = localStorage.getItem('itemsPorServicio');
  if (itemsGuardados) {
    itemsPorServicio.value = JSON.parse(itemsGuardados);
  }

  const rolesGuardados = localStorage.getItem('rolesPersonalizados');
  if (rolesGuardados) {
    rolesPersonalizados.value = JSON.parse(rolesGuardados);
  }

  const limosinasGuardadas = localStorage.getItem('limosinas');
  if (limosinasGuardadas) {
    limosinasPredefinidas.value = JSON.parse(limosinasGuardadas);
  }
});

// Computed para todos los roles disponibles
const rolesDisponibles = computed(() => {
  return [...rolesBase, ...rolesPersonalizados.value];
});

// Funciones para gestionar items predefinidos
const agregarItemPredefinido = () => {
  if (nuevoItemPredefinido.value.trim() && servicioSeleccionado.value) {
    if (!itemsPorServicio.value[servicioSeleccionado.value]) {
      itemsPorServicio.value[servicioSeleccionado.value] = [];
    }
    itemsPorServicio.value[servicioSeleccionado.value].push(nuevoItemPredefinido.value.trim());
    localStorage.setItem('itemsPorServicio', JSON.stringify(itemsPorServicio.value));
    nuevoItemPredefinido.value = '';
  }
};

const eliminarItemPredefinido = (item: string) => {
  if (servicioSeleccionado.value) {
    itemsPorServicio.value[servicioSeleccionado.value] = 
      itemsPorServicio.value[servicioSeleccionado.value].filter(i => i !== item);
    localStorage.setItem('itemsPorServicio', JSON.stringify(itemsPorServicio.value));
  }
};

// Funciones para gestionar roles
const agregarNuevoRol = () => {
  if (nuevoRol.value.trim()) {
    rolesPersonalizados.value.push(nuevoRol.value.trim());
    localStorage.setItem('rolesPersonalizados', JSON.stringify(rolesPersonalizados.value));
    nuevoRol.value = '';
  }
};

const eliminarRol = (rol: string) => {
  rolesPersonalizados.value = rolesPersonalizados.value.filter(r => r !== rol);
  localStorage.setItem('rolesPersonalizados', JSON.stringify(rolesPersonalizados.value));
};

// Funciones para gestionar limosinas
const agregarLimosina = () => {
  if (nuevaLimosina.value.nombre && nuevaLimosina.value.capacidad > 0) {
    const nuevaLimosinaObj = {
      id: crypto.randomUUID(),
      nombre: nuevaLimosina.value.nombre,
      capacidad: nuevaLimosina.value.capacidad,
      descripcion: ''
    };
    limosinasPredefinidas.value.push(nuevaLimosinaObj);
    localStorage.setItem('limosinas', JSON.stringify(limosinasPredefinidas.value));
    nuevaLimosina.value = { nombre: '', capacidad: 0 };
  }
};

const eliminarLimosina = (id: string) => {
  limosinasPredefinidas.value = limosinasPredefinidas.value.filter(l => l.id !== id);
  localStorage.setItem('limosinas', JSON.stringify(limosinasPredefinidas.value));
  if (limosinaSeleccionada.value === id) {
    limosinaSeleccionada.value = '';
  }
};

// Funciones para gestionar items y personal
const agregarItem = () => {
  if (nuevoItem.value.nombre) {
    const item: Item = {
      id: crypto.randomUUID(),
      nombre: nuevoItem.value.nombre,
      cantidad: nuevoItem.value.cantidad || 1,
      precioUnitario: nuevoItem.value.precioUnitario || 0
    };
    nuevoServicio.value.items = [...(nuevoServicio.value.items || []), item];
    nuevoItem.value = { nombre: '', cantidad: 1, precioUnitario: 0 };
  }
};

const agregarItemDesdePredefinido = (nombreItem: string) => {
  const item: Item = {
    id: crypto.randomUUID(),
    nombre: nombreItem,
    cantidad: 1,
    precioUnitario: 0
  };
  nuevoServicio.value.items = [...(nuevoServicio.value.items || []), item];
};

const agregarPersonal = () => {
  if (nuevoPersonal.value.nombre && nuevoPersonal.value.rol) {
    const personal: Personal = {
      id: crypto.randomUUID(),
      nombre: nuevoPersonal.value.nombre,
      rol: nuevoPersonal.value.rol
    };
    nuevoServicio.value.personal = [...(nuevoServicio.value.personal || []), personal];
    nuevoPersonal.value = { nombre: '', rol: '' };
  }
};

const eliminarItem = (id: string) => {
  if (nuevoServicio.value.items) {
    nuevoServicio.value.items = nuevoServicio.value.items.filter(item => item.id !== id);
  }
};

const eliminarPersonal = (id: string) => {
  if (nuevoServicio.value.personal) {
    nuevoServicio.value.personal = nuevoServicio.value.personal.filter(p => p.id !== id);
  }
};

// Función para seleccionar tipo de servicio
const seleccionarTipoServicio = (tipo: string) => {
  servicioSeleccionado.value = tipo;
  const servicio = tiposServicio.find(s => s.id === tipo);
  if (servicio) {
    nuevoServicio.value = {
      nombre: servicio.nombre,
      descripcion: '',
      tipo: 'hora',
      duracion: 1,
      personal: [],
      items: []
    };
  }
};

// Función para guardar el servicio
const guardarServicio = () => {
  if (nuevoServicio.value.nombre) {
    const servicio: Servicio = {
      id: crypto.randomUUID(),
      nombre: nuevoServicio.value.nombre,
      descripcion: nuevoServicio.value.descripcion || '',
      precio: 0,
      tipo: nuevoServicio.value.tipo || 'hora',
      duracion: nuevoServicio.value.duracion,
      personal: nuevoServicio.value.personal || [],
      items: nuevoServicio.value.items || []
    };

    // Si es servicio de limosina, agregar detalles específicos
    if (servicioSeleccionado.value === 'limosina' && limosinaSeleccionada.value) {
      const limosina = limosinasPredefinidas.value.find(l => l.id === limosinaSeleccionada.value);
      if (limosina) {
        servicio.descripcion = `${limosina.nombre} - Capacidad: ${limosina.capacidad} personas - Hora: ${horaInicio.value}`;
        servicio.duracion = duracionHoras.value;
      }
    }

    emit('servicio-creado', servicio);
    
    // Resetear el formulario
    nuevoServicio.value = {
      nombre: '',
      descripcion: '',
      tipo: 'hora',
      duracion: 1,
      personal: [],
      items: []
    };
    servicioSeleccionado.value = '';
    limosinaSeleccionada.value = '';
    horaInicio.value = '';
    duracionHoras.value = 1;
  }
};
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-semibold mb-4">Nuevo Servicio</h3>
    
    <!-- Selección de tipo de servicio -->
    <div class="mb-6">
      <label class="block text-sm font-medium mb-2">Tipo de Servicio</label>
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="tipo in tiposServicio"
          :key="tipo.id"
          @click="seleccionarTipoServicio(tipo.id)"
          :class="[
            'p-4 rounded-lg border text-left transition-colors relative',
            servicioSeleccionado === tipo.id
              ? 'bg-blue-50 border-blue-500'
              : 'hover:bg-gray-50 border-gray-200'
          ]"
        >
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ tipo.icono }}</span>
            <h4 class="font-medium">{{ tipo.nombre }}</h4>
          </div>
        </button>
      </div>
    </div>

    <template v-if="servicioSeleccionado">
      <!-- Información básica del servicio -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium mb-1">Nombre del Servicio</label>
          <input v-model="nuevoServicio.nombre" type="text" class="w-full p-2 border rounded">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Descripción</label>
          <input v-model="nuevoServicio.descripcion" type="text" class="w-full p-2 border rounded">
        </div>
      </div>

      <!-- Items predefinidos -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-3">
          <h4 class="font-medium text-lg">Items Predefinidos</h4>
          <div class="flex items-center gap-2">
            <input 
              v-model="nuevoItemPredefinido"
              type="text"
              class="p-2 border rounded"
              placeholder="Nuevo item predefinido"
              @keyup.enter="agregarItemPredefinido"
            >
            <button 
              @click="agregarItemPredefinido"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
            >
              <span>Agregar</span>
              <span class="text-xl">➕</span>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div
            v-for="item in itemsPorServicio[servicioSeleccionado]"
            :key="item"
            class="p-3 border rounded-lg hover:bg-gray-50 text-left group relative flex justify-between items-center"
          >
            <span>{{ item }}</span>
            <div class="flex gap-2">
              <button 
                @click="agregarItemDesdePredefinido(item)"
                class="text-green-600 hover:text-green-800"
                title="Agregar al servicio"
              >
                ➕
              </button>
              <button 
                @click="eliminarItemPredefinido(item)"
                class="text-red-600 hover:text-red-800"
                title="Eliminar de predefinidos"
              >
                ❌
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Servicio de Limosina -->
      <template v-if="servicioSeleccionado === 'limosina'">
        <div class="mb-6">
          <div class="mb-4">
            <h4 class="font-medium text-lg mb-3">Agregar Nueva Limosina</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Nombre de la Limosina</label>
                <input 
                  v-model="nuevaLimosina.nombre"
                  type="text"
                  class="w-full p-2 border rounded"
                  placeholder="Ej: Limosina Stretch Negra"
                >
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Capacidad (personas)</label>
                <input 
                  v-model="nuevaLimosina.capacidad"
                  type="number"
                  min="1"
                  class="w-full p-2 border rounded"
                >
              </div>
            </div>
            <button 
              @click="agregarLimosina"
              class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <span>Agregar Limosina</span>
              <span class="text-xl">➕</span>
            </button>
          </div>

          <h4 class="font-medium text-lg mb-3">Limosinas Disponibles</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="limosina in limosinasPredefinidas" 
              :key="limosina.id"
              class="border p-4 rounded-lg cursor-pointer group relative transition-all duration-200"
              :class="{ 
                'border-blue-500 bg-blue-50': limosinaSeleccionada === limosina.id,
                'hover:border-gray-400': limosinaSeleccionada !== limosina.id
              }"
              @click="limosinaSeleccionada = limosina.id"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h5 class="font-medium text-lg">{{ limosina.nombre }}</h5>
                  <p class="text-sm text-gray-600 mt-1">
                    Capacidad: {{ limosina.capacidad }} personas
                  </p>
                  <p v-if="limosina.descripcion" class="text-sm text-gray-500 mt-2">
                    {{ limosina.descripcion }}
                  </p>
                </div>
                <button 
                  @click.stop="eliminarLimosina(limosina.id)"
                  class="text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar limosina"
                >
                  ❌
                </button>
              </div>
              
              <div 
                v-if="limosinaSeleccionada === limosina.id"
                class="mt-3 pt-3 border-t border-blue-200"
              >
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-1">Hora de inicio</label>
                    <input 
                      v-model="horaInicio" 
                      type="time" 
                      class="w-full p-2 border rounded" 
                      required
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Duración (horas)</label>
                    <input 
                      v-model="duracionHoras" 
                      type="number" 
                      min="1" 
                      class="w-full p-2 border rounded"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Servicio de Personal -->
      <template v-if="servicioSeleccionado === 'personal'">
        <div class="mb-6">
          <div class="mb-4">
            <h4 class="font-medium text-lg mb-3">Agregar Nuevo Cargo</h4>
            <div class="flex gap-2">
              <input 
                v-model="nuevoRol"
                type="text"
                class="flex-1 p-2 border rounded"
                placeholder="Nombre del nuevo cargo"
                @keyup.enter="agregarNuevoRol"
              >
              <button 
                @click="agregarNuevoRol"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Agregar Cargo
              </button>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="font-medium text-lg mb-3">Cargos Disponibles</h4>
            <div class="flex flex-wrap gap-2">
              <div 
                v-for="rol in rolesPersonalizados" 
                :key="rol"
                class="flex items-center bg-gray-100 px-3 py-1 rounded"
              >
                <span>{{ rol }}</span>
                <button 
                  @click="eliminarRol(rol)"
                  class="ml-2 text-red-600 hover:text-red-800"
                >
                  ❌
                </button>
              </div>
            </div>
          </div>

          <h4 class="font-medium text-lg mb-3">Agregar Personal</h4>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nombre</label>
              <input 
                v-model="nuevoPersonal.nombre"
                type="text"
                class="w-full p-2 border rounded"
                placeholder="Nombre completo"
              >
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Cargo</label>
              <select 
                v-model="nuevoPersonal.rol"
                class="w-full p-2 border rounded"
              >
                <option value="">Seleccionar cargo</option>
                <option v-for="rol in rolesDisponibles" :key="rol" :value="rol">
                  {{ rol }}
                </option>
              </select>
            </div>
          </div>
          <button 
            @click="agregarPersonal"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Agregar Personal
          </button>
        </div>
      </template>

      <!-- Nuevo Item Personalizado -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-3">
          <h4 class="font-medium text-lg">Agregar Item Personalizado</h4>
          <span class="text-2xl text-blue-500">✏️</span>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre</label>
            <input 
              v-model="nuevoItem.nombre"
              type="text"
              class="w-full p-2 border rounded"
              placeholder="Nombre del item"
            >
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Cantidad</label>
            <input 
              v-model="nuevoItem.cantidad"
              type="number"
              min="1"
              class="w-full p-2 border rounded"
            >
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Precio Unitario</label>
            <input 
              v-model="nuevoItem.precioUnitario"
              type="number"
              min="0"
              step="0.01"
              class="w-full p-2 border rounded"
            >
          </div>
        </div>
        <button 
          @click="agregarItem"
          class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <span>Agregar Item</span>
          <span class="text-xl">➕</span>
        </button>
      </div>

      <!-- Lista de Items -->
      <div v-if="nuevoServicio.items && nuevoServicio.items.length > 0" class="mb-6">
        <div class="flex justify-between items-center mb-3">
          <h4 class="font-medium text-lg">Items Incluidos</h4>
          <span class="text-sm text-gray-600">
            {{ nuevoServicio.items.length }} items
          </span>
        </div>
        <div class="space-y-2">
          <div 
            v-for="item in nuevoServicio.items" 
            :key="item.id" 
            class="flex justify-between items-center p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
          >
            <div>
              <span class="font-medium">{{ item.nombre }}</span>
              <span class="text-gray-600 ml-2">
                ({{ item.cantidad }} x ${{ item.precioUnitario }})
              </span>
            </div>
            <button 
              @click="eliminarItem(item.id)"
              class="text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
            >
              <span class="text-sm">Eliminar</span>
              <span class="text-xl">❌</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de Personal -->
      <div v-if="nuevoServicio.personal && nuevoServicio.personal.length > 0" class="mb-6">
        <h4 class="font-medium text-lg mb-3">Personal Asignado</h4>
        <div class="space-y-2">
          <div 
            v-for="persona in nuevoServicio.personal" 
            :key="persona.id" 
            class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <span class="font-medium">{{ persona.nombre }}</span>
              <span class="text-gray-600 ml-2">({{ persona.rol }})</span>
            </div>
            <button 
              @click="eliminarPersonal(persona.id)"
              class="text-red-600 hover:text-red-800"
            >
              ❌
            </button>
          </div>
        </div>
      </div>

      <button 
        @click="guardarServicio"
        class="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 w-full"
      >
        Guardar Servicio
      </button>
    </template>
  </div>
</template>