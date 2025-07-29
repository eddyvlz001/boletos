<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const emit = defineEmits(['pago-actualizado']);

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({
      subtotal: 0,
      abono: 0,
      formaPago: 'efectivo'
    })
  }
});

interface Pago {
  subtotal: number;
  propinaChofer: number;
  impuesto: number;
  total: number;
  formaPago: 'efectivo' | 'cheque' | 'credito' | 'debito';
  abono: number;
  saldo: number;
}

const TASA_IMPUESTO = 0.0853; // 8.53%

const pago = ref<Pago>({
  subtotal: 0,
  propinaChofer: 0,
  impuesto: 0,
  total: 0,
  formaPago: 'efectivo',
  abono: 0,
  saldo: 0
});

// Inicializar con valores proporcionados
onMounted(() => {
  if (props.initialValues) {
    pago.value.subtotal = props.initialValues.subtotal || 0;
    pago.value.abono = props.initialValues.abono || 0;
    pago.value.formaPago = props.initialValues.formaPago || 'efectivo';
    
    // Calcular los valores derivados
    actualizarPago();
  }
});

const impuesto = computed(() => {
  return (pago.value.subtotal + pago.value.propinaChofer) * TASA_IMPUESTO;
});

const total = computed(() => {
  return pago.value.subtotal + pago.value.propinaChofer + impuesto.value;
});

const saldo = computed(() => {
  return total.value - pago.value.abono;
});

const actualizarPago = () => {
  pago.value.impuesto = impuesto.value;
  pago.value.total = total.value;
  pago.value.saldo = saldo.value;
  emit('pago-actualizado', pago.value);
};

const formasPago = [
  { id: 'efectivo', nombre: 'Efectivo' },
  { id: 'cheque', nombre: 'Cheque' },
  { id: 'credito', nombre: 'Tarjeta de Crédito' },
  { id: 'debito', nombre: 'Tarjeta de Débito' }
];

// Actualizar cuando cambian los valores
watch(() => [pago.value.subtotal, pago.value.propinaChofer, pago.value.abono, pago.value.formaPago], () => {
  actualizarPago();
}, { deep: true });
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-semibold mb-6">Información de Pago</h3>
    
    <div class="space-y-6">
      <!-- Subtotal y Propina -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Subtotal
          </label>
          <div class="relative">
            <span class="absolute left-3 top-2">$</span>
            <input
              v-model.number="pago.subtotal"
              type="number"
              min="0"
              step="0.01"
              class="w-full pl-8 p-2 border rounded"
              @input="actualizarPago"
            >
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Propina del Chofer
          </label>
          <div class="relative">
            <span class="absolute left-3 top-2">$</span>
            <input
              v-model.number="pago.propinaChofer"
              type="number"
              min="0"
              step="0.01"
              class="w-full pl-8 p-2 border rounded"
              @input="actualizarPago"
            >
          </div>
        </div>
      </div>

      <!-- Impuesto -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Impuesto (8.53%)
        </label>
        <div class="relative bg-gray-50">
          <span class="absolute left-3 top-2">$</span>
          <input
            :value="impuesto.toFixed(2)"
            type="text"
            readonly
            class="w-full pl-8 p-2 border rounded bg-gray-50"
          >
        </div>
      </div>

      <!-- Total -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <div class="text-lg font-medium text-gray-700 mb-2">Total</div>
        <div class="text-3xl font-bold text-gray-900">${{ total.toFixed(2) }}</div>
      </div>

      <!-- Forma de Pago -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Forma de Pago
        </label>
        <div class="grid grid-cols-2 gap-4">
          <button
            v-for="forma in formasPago"
            :key="forma.id"
            @click="pago.formaPago = forma.id as 'efectivo' | 'cheque' | 'credito' | 'debito'"
            :class="[
              'p-3 border rounded-lg text-center transition-colors',
              pago.formaPago === forma.id
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'hover:bg-gray-50'
            ]"
          >
            {{ forma.nombre }}
          </button>
        </div>
      </div>

      <!-- Abono y Saldo -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Abono
          </label>
          <div class="relative">
            <span class="absolute left-3 top-2">$</span>
            <input
              v-model.number="pago.abono"
              type="number"
              min="0"
              :max="total"
              step="0.01"
              class="w-full pl-8 p-2 border rounded"
              @input="actualizarPago"
            >
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Saldo Pendiente
          </label>
          <div class="relative bg-gray-50">
            <span class="absolute left-3 top-2">$</span>
            <input
              :value="saldo.toFixed(2)"
              type="text"
              readonly
              class="w-full pl-8 p-2 border rounded bg-gray-50"
            >
          </div>
        </div>
      </div>

      <!-- Firmas -->
      <div class="mt-8">
        <h4 class="text-lg font-medium text-gray-900 mb-6">Firmas</h4>
        
        <div class="flex justify-between gap-8">
          <!-- Cliente -->
          <div class="flex-1">
            <div class="h-24 border-b border-gray-300 mb-2"></div>
            <div class="text-center text-sm text-gray-600">Firma del Cliente</div>
          </div>

          <!-- Representante -->
          <div class="flex-1">
            <div class="h-24 border-b border-gray-300 mb-2"></div>
            <div class="text-center text-sm text-gray-600">Firma del Representante</div>
          </div>
        </div>

        <!-- Fecha -->
        <div class="text-center text-sm text-gray-600 mt-4">
          Fecha: {{ new Date().toLocaleDateString() }}
        </div>
      </div>
    </div>
  </div>
</template>