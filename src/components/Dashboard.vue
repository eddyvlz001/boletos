<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const contratos = ref([]);
const ordenes = ref([]);
const rifas = ref([]);
const mostrarModal = ref(false);
const contratoSeleccionado = ref(null);

onMounted(() => {
  cargarDatos();
});

const cargarDatos = () => {
  // Cargar contratos
  const contratosGuardados = JSON.parse(localStorage.getItem('contratos') || '[]');
  contratos.value = contratosGuardados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
  // Cargar órdenes de trabajo
  const ordenesGuardadas = JSON.parse(localStorage.getItem('ordenesTrabajo') || '[]');
  ordenes.value = ordenesGuardadas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
  // Cargar rifas
  const rifasGuardadas = JSON.parse(localStorage.getItem('rifas') || '[]');
  rifas.value = rifasGuardadas;
};

const editarContrato = (contrato) => {
  localStorage.setItem('contratoEditar', JSON.stringify(contrato));
  router.push({ name: 'nuevo-contrato', query: { editar: 'true' } });
};

const editarOrden = (orden) => {
  localStorage.setItem('ordenEditar', JSON.stringify(orden));
  router.push({ name: 'orden-trabajo', query: { editar: 'true' } });
};

const verDetallesContrato = (contrato) => {
  contratoSeleccionado.value = contrato;
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
  contratoSeleccionado.value = null;
};

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString();
};

const obtenerEstadoClase = (estado) => {
  switch (estado) {
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800';
    case 'completado':
      return 'bg-green-100 text-green-800';
    case 'cancelado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
</script>

<template>
  <div class="glass-section">
    <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
      Dashboard
    </h2>

    <!-- Contratos Recientes -->
    <div class="glass rounded-xl p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">Contratos Recientes</h3>
        <button 
          @click="router.push('/nuevo-contrato')"
          class="glass-button-primary"
        >
          Nuevo Contrato
        </button>
      </div>

      <div v-if="contratos.length === 0" class="text-center py-8 text-gray-500">
        No hay contratos registrados
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contrato
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evento
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="contrato in contratos.slice(0, 5)" :key="contrato.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                {{ contrato.numeroContrato }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ contrato.cliente.nombre }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ contrato.evento.tipo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ formatearFecha(contrato.fecha) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                ${{ contrato.total }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  obtenerEstadoClase(contrato.estado)
                ]">
                  {{ contrato.estado }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="verDetallesContrato(contrato)"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Ver
                </button>
                <button 
                  @click="editarContrato(contrato)"
                  class="text-green-600 hover:text-green-900"
                >
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Órdenes de Trabajo -->
    <div class="glass rounded-xl p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">Órdenes de Trabajo</h3>
        <button 
          @click="router.push('/orden-trabajo')"
          class="glass-button-primary"
        >
          Nueva Orden
        </button>
      </div>

      <div v-if="ordenes.length === 0" class="text-center py-8 text-gray-500">
        No hay órdenes de trabajo registradas
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orden
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridad
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="orden in ordenes.slice(0, 5)" :key="orden.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                {{ orden.numeroOrden }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ orden.cliente.nombre }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ formatearFecha(orden.fecha) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  orden.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                  orden.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                ]">
                  {{ orden.prioridad }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  obtenerEstadoClase(orden.estado)
                ]">
                  {{ orden.estado }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="editarOrden(orden)"
                  class="text-green-600 hover:text-green-900"
                >
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Detalles de Contrato -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">
              Detalles del Contrato #{{ contratoSeleccionado?.numeroContrato }}
            </h3>
            <button 
              @click="cerrarModal"
              class="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div v-if="contratoSeleccionado" class="space-y-6">
            <!-- Información del Cliente -->
            <div>
              <h4 class="font-medium text-lg mb-2">Información del Cliente</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-gray-500">Nombre:</span>
                  <span class="ml-2">{{ contratoSeleccionado.cliente.nombre }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Email:</span>
                  <span class="ml-2">{{ contratoSeleccionado.cliente.email }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Teléfono:</span>
                  <span class="ml-2">{{ contratoSeleccionado.cliente.telefono }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Dirección:</span>
                  <span class="ml-2">{{ contratoSeleccionado.cliente.direccion }}</span>
                </div>
              </div>
            </div>

            <!-- Detalles del Evento -->
            <div>
              <h4 class="font-medium text-lg mb-2">Detalles del Evento</h4>
              <div class="space-y-2">
                <div v-for="detalle in contratoSeleccionado.evento.detallesEspecificos" :key="detalle.id">
                  <span class="text-gray-500">{{ detalle.nombre }}:</span>
                  <span class="ml-2">{{ detalle.valor }}</span>
                </div>
              </div>
            </div>

            <!-- Servicios -->
            <div v-if="contratoSeleccionado.servicios && contratoSeleccionado.servicios.length">
              <h4 class="font-medium text-lg mb-2">Servicios Contratados</h4>
              <div class="space-y-4">
                <div 
                  v-for="servicio in contratoSeleccionado.servicios" 
                  :key="servicio.id"
                  class="p-4 border rounded-lg"
                >
                  <div class="flex justify-between">
                    <h5 class="font-medium">{{ servicio.nombre }}</h5>
                    <span>${{ servicio.precio }}</span>
                  </div>
                  <p class="text-gray-600">{{ servicio.descripcion }}</p>
                </div>
              </div>
            </div>

            <!-- Resumen de Pago -->
            <div>
              <h4 class="font-medium text-lg mb-2">Resumen de Pago</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-gray-500">Total:</span>
                  <span class="ml-2 font-medium">${{ contratoSeleccionado.total }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Anticipo:</span>
                  <span class="ml-2 font-medium">${{ contratoSeleccionado.anticipo }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Saldo:</span>
                  <span class="ml-2 font-medium">${{ contratoSeleccionado.saldo }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Forma de Pago:</span>
                  <span class="ml-2">{{ contratoSeleccionado.formaPago }}</span>
                </div>
              </div>
            </div>

            <!-- Notas -->
            <div v-if="contratoSeleccionado.notas">
              <h4 class="font-medium text-lg mb-2">Notas</h4>
              <p class="text-gray-600 whitespace-pre-line">{{ contratoSeleccionado.notas }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
          <button 
            @click="cerrarModal"
            class="glass-button"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>