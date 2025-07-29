<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { OrdenTrabajo, Cliente, ItemOrden } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { createPrintWindow, addPage, createItemsTable, formatCurrency, formatDate } from '../utils/printingUtils';

const route = useRoute();
const isEditing = computed(() => route.query.editar === 'true');

const TASA_IMPUESTO = 0.0853; // 8.53%

const tipoOrden = ref<'camiseta' | 'hoodie' | 'gorra' | 'taza' | 'tarjeta' | 'otro'>('camiseta');
const clienteBusqueda = ref('');
const mostrarClientesGuardados = ref(false);
const clientesGuardados = ref<Cliente[]>([]);
const colorPersonalizado = ref('');
const mostrarColorPersonalizado = ref(false);
const editandoItem = ref<string | null>(null);

// Estado de la orden
const orden = ref<Partial<OrdenTrabajo>>({
  cliente: {
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: ''
  },
  items: [],
  detalles: {},
  especificaciones: '',
  prioridad: 'media',
  estado: 'pendiente',
  subtotal: 0,
  impuesto: 0,
  total: 0,
  anticipo: 0,
  saldo: 0,
  formaPago: 'efectivo'
});

// Nuevo item
const nuevoItem = ref<Partial<ItemOrden> & { precio?: number }>({
  tipo: 'camiseta',
  talla: 'M',
  color: 'Blanco',
  cantidad: 1,
  tipoImpresion: 'Sublimación',
  impresionFrente: true,
  impresionAtras: false,
  descripcion: '',
  precio: 0
});

// Opciones
const tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const colores = ['Blanco', 'Negro', 'Gris', 'Azul', 'Rojo', 'Verde', 'Amarillo', 'Personalizado'];
const tiposImpresion = ['Sublimación', 'Vinil Textil', 'Serigrafía', 'DTF', 'Bordado'];

// Watch para el color seleccionado
watch(() => nuevoItem.value.color, (newColor) => {
  if (newColor === 'Personalizado') {
    mostrarColorPersonalizado.value = true;
    colorPersonalizado.value = '';
  } else {
    mostrarColorPersonalizado.value = false;
  }
});

// Cargar clientes guardados y orden si estamos editando
onMounted(() => {
  const contratos = JSON.parse(localStorage.getItem('contratos') || '[]');
  const clientesUnicos = new Map();
  
  contratos.forEach((contrato: any) => {
    const clienteKey = contrato.cliente.email || contrato.cliente.telefono;
    if (clienteKey && !clientesUnicos.has(clienteKey)) {
      clientesUnicos.set(clienteKey, contrato.cliente);
    }
  });
  
  clientesGuardados.value = Array.from(clientesUnicos.values());
  
  // Si estamos editando, cargar la orden
  if (isEditing.value) {
    const ordenEditar = localStorage.getItem('ordenEditar');
    if (ordenEditar) {
      const ordenData = JSON.parse(ordenEditar);
      orden.value = {
        ...ordenData,
        fecha: new Date(ordenData.fecha)
      };
      
      // Asegurarse de que cada item tenga un precio
      if (orden.value.items) {
        orden.value.items = orden.value.items.map(item => ({
          ...item,
          precio: item.precio || 0
        }));
      }
      
      // Recalcular subtotal basado en los precios de los items
      recalcularSubtotal();
    }
  }
});

// Filtrar clientes
const clientesFiltrados = computed(() => {
  const busqueda = clienteBusqueda.value.toLowerCase();
  return clientesGuardados.value.filter(cliente => 
    cliente.nombre.toLowerCase().includes(busqueda) ||
    cliente.email.toLowerCase().includes(busqueda) ||
    cliente.telefono.includes(busqueda)
  );
});

// Seleccionar cliente
const seleccionarCliente = (cliente: Cliente) => {
  orden.value.cliente = { 
    ...cliente,
    ciudad: cliente.ciudad || '',
    codigoPostal: cliente.codigoPostal || ''
  };
  clienteBusqueda.value = '';
  mostrarClientesGuardados.value = false;
};

// Agregar item
const agregarItem = () => {
  if (nuevoItem.value.cantidad) {
    const item: ItemOrden & { precio: number } = {
      id: crypto.randomUUID(),
      tipo: nuevoItem.value.tipo!,
      talla: nuevoItem.value.talla,
      color: nuevoItem.value.color === 'Personalizado' ? colorPersonalizado.value : nuevoItem.value.color,
      cantidad: nuevoItem.value.cantidad,
      tipoImpresion: nuevoItem.value.tipoImpresion,
      impresionFrente: nuevoItem.value.impresionFrente,
      impresionAtras: nuevoItem.value.impresionAtras,
      descripcion: nuevoItem.value.descripcion,
      precio: nuevoItem.value.precio || 0
    };
    
    orden.value.items = [...(orden.value.items || []), item];
    
    // Resetear nuevo item
    nuevoItem.value = {
      tipo: 'camiseta',
      talla: 'M',
      color: 'Blanco',
      cantidad: 1,
      tipoImpresion: 'Sublimación',
      impresionFrente: true,
      impresionAtras: false,
      descripcion: '',
      precio: 0
    };
    colorPersonalizado.value = '';
    mostrarColorPersonalizado.value = false;
    
    // Recalcular subtotal
    recalcularSubtotal();
  }
};

// Editar item
const iniciarEdicionItem = (item: ItemOrden & { precio?: number }) => {
  editandoItem.value = item.id;
  nuevoItem.value = { 
    ...item,
    precio: item.precio || 0
  };
  
  if (!colores.includes(item.color || '')) {
    nuevoItem.value.color = 'Personalizado';
    mostrarColorPersonalizado.value = true;
    colorPersonalizado.value = item.color || '';
  }
};

// Actualizar item
const actualizarItem = () => {
  if (!editandoItem.value || !nuevoItem.value.cantidad) return;
  
  const items = orden.value.items || [];
  const index = items.findIndex(item => item.id === editandoItem.value);
  
  if (index !== -1) {
    const itemActualizado: ItemOrden & { precio: number } = {
      ...items[index],
      tipo: nuevoItem.value.tipo!,
      talla: nuevoItem.value.talla,
      color: nuevoItem.value.color === 'Personalizado' ? colorPersonalizado.value : nuevoItem.value.color,
      cantidad: nuevoItem.value.cantidad,
      tipoImpresion: nuevoItem.value.tipoImpresion,
      impresionFrente: nuevoItem.value.impresionFrente,
      impresionAtras: nuevoItem.value.impresionAtras,
      descripcion: nuevoItem.value.descripcion,
      precio: nuevoItem.value.precio || 0
    };
    
    items[index] = itemActualizado;
    orden.value.items = [...items];
    
    // Resetear estado de edición
    editandoItem.value = null;
    nuevoItem.value = {
      tipo: 'camiseta',
      talla: 'M',
      color: 'Blanco',
      cantidad: 1,
      tipoImpresion: 'Sublimación',
      impresionFrente: true,
      impresionAtras: false,
      descripcion: '',
      precio: 0
    };
    colorPersonalizado.value = '';
    mostrarColorPersonalizado.value = false;
    
    // Recalcular subtotal
    recalcularSubtotal();
  }
};

// Cancelar edición
const cancelarEdicion = () => {
  editandoItem.value = null;
  nuevoItem.value = {
    tipo: 'camiseta',
    talla: 'M',
    color: 'Blanco',
    cantidad: 1,
    tipoImpresion: 'Sublimación',
    impresionFrente: true,
    impresionAtras: false,
    descripcion: '',
    precio: 0
  };
  colorPersonalizado.value = '';
  mostrarColorPersonalizado.value = false;
};

// Eliminar item
const eliminarItem = (id: string) => {
  orden.value.items = orden.value.items?.filter(item => item.id !== id);
  recalcularSubtotal();
};

// Recalcular subtotal basado en los precios de los items
const recalcularSubtotal = () => {
  if (!orden.value.items || orden.value.items.length === 0) {
    orden.value.subtotal = 0;
  } else {
    orden.value.subtotal = orden.value.items.reduce((total, item: any) => {
      return total + (item.cantidad * (item.precio || 0));
    }, 0);
  }
  
  calcularImpuesto();
};

// Calcular impuesto
const calcularImpuesto = () => {
  if (orden.value.subtotal !== undefined) {
    orden.value.impuesto = orden.value.subtotal * TASA_IMPUESTO;
    calcularTotal();
  }
};

// Calcular total
const calcularTotal = () => {
  if (orden.value.subtotal !== undefined && orden.value.impuesto !== undefined) {
    orden.value.total = orden.value.subtotal + orden.value.impuesto;
    calcularSaldo();
  }
};

// Calcular saldo
const calcularSaldo = () => {
  if (orden.value.total !== undefined && orden.value.anticipo !== undefined) {
    orden.value.saldo = orden.value.total - orden.value.anticipo;
  }
};

// Watch para subtotal
watch(() => orden.value.subtotal, (newValue) => {
  if (newValue !== undefined) {
    calcularImpuesto();
  }
});

// Watch para anticipo
watch(() => orden.value.anticipo, (newValue) => {
  if (newValue !== undefined) {
    calcularSaldo();
  }
});

// Guardar orden
const guardarOrden = () => {
  const nuevaOrden: OrdenTrabajo = {
    id: orden.value.id || crypto.randomUUID(),
    numeroOrden: orden.value.numeroOrden || `OT-${Date.now()}`,
    fecha: orden.value.fecha || new Date(),
    ...orden.value as Omit<OrdenTrabajo, 'id' | 'numeroOrden' | 'fecha'>
  };

  // Guardar en localStorage
  const ordenes = JSON.parse(localStorage.getItem('ordenesTrabajo') || '[]');
  
  if (isEditing.value) {
    // Si estamos editando, actualizar la orden existente
    const index = ordenes.findIndex((o: OrdenTrabajo) => o.id === nuevaOrden.id);
    if (index !== -1) {
      ordenes[index] = nuevaOrden;
    } else {
      ordenes.push(nuevaOrden);
    }
  } else {
    // Si es nueva, agregarla al array
    ordenes.push(nuevaOrden);
  }
  
  localStorage.setItem('ordenesTrabajo', JSON.stringify(ordenes));
  localStorage.removeItem('ordenEditar'); // Limpiar la orden en edición

  // Imprimir orden
  imprimirOrden(nuevaOrden);

  // Resetear formulario si no estamos editando
  if (!isEditing.value) {
    orden.value = {
      cliente: {
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        codigoPostal: ''
      },
      items: [],
      detalles: {},
      especificaciones: '',
      prioridad: 'media',
      estado: 'pendiente',
      subtotal: 0,
      impuesto: 0,
      total: 0,
      anticipo: 0,
      saldo: 0,
      formaPago: 'efectivo'
    };
  }
};

// Imprimir orden usando la nueva librería
const imprimirOrden = (orden: OrdenTrabajo) => {
  // Obtener información de la empresa
  const empresaInfo = JSON.parse(localStorage.getItem('informacionEmpresa') || '{}');
  
  // Crear ventana de impresión
  const printWindow = createPrintWindow({
    title: `Orden de Trabajo #${orden.numeroOrden}`,
    pageSize: 'letter'
  });
  
  if (!printWindow) return;
  
  // Crear contenido del encabezado
  const headerContent = `
    <div class="header" style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        ${empresaInfo.logo ? `
          <div style="width: 100px; height: 100px;">
            <img src="${empresaInfo.logo}" alt="Logo" style="max-width: 100%; max-height: 100%; object-fit: contain;">
          </div>
        ` : '<div style="width: 100px;"></div>'}
        <div style="text-align: right; font-size: 9pt;">
          ${empresaInfo.nombre ? `<h2 style="color: #2563eb; margin: 0 0 5px 0; font-size: 16pt;">${empresaInfo.nombre}</h2>` : ''}
          ${empresaInfo.direccion ? `<p>${empresaInfo.direccion}</p>` : ''}
          ${empresaInfo.telefono ? `<p>Tel: ${empresaInfo.telefono}</p>` : ''}
          ${empresaInfo.email ? `<p>${empresaInfo.email}</p>` : ''}
        </div>
      </div>
      <div style="font-size: 12pt; color: #2563eb; margin: 5px 0;">
        Orden de Trabajo #${orden.numeroOrden}
      </div>
      <div style="margin-top: 10px;">
        <span style="display: inline-block; padding: 3px 8px; border-radius: 3px; font-weight: bold; text-transform: uppercase; font-size: 8pt; 
          ${orden.prioridad === 'baja' ? 'background: #dbeafe; color: #1e40af;' : 
          orden.prioridad === 'media' ? 'background: #fef3c7; color: #92400e;' :
          orden.prioridad === 'alta' ? 'background: #fee2e2; color: #991b1b;' :
          'background: #dc2626; color: white;'}">
          Prioridad: ${orden.prioridad}
        </span>
      </div>
      <p>Fecha: ${format(orden.fecha, 'PPP', { locale: es })}</p>
    </div>
  `;
  
  // Crear contenido de información del cliente
  const clienteContent = `
    <div class="section">
      <div class="section-title">Información del Cliente</div>
      <div class="grid">
        <div class="detail">
          <span class="detail-label">Nombre:</span>
          <span>${orden.cliente.nombre}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Email:</span>
          <span>${orden.cliente.email}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Teléfono:</span>
          <span>${orden.cliente.telefono}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Dirección:</span>
          <span>${orden.cliente.direccion}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Ciudad:</span>
          <span>${orden.cliente.ciudad}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Código Postal:</span>
          <span>${orden.cliente.codigoPostal}</span>
        </div>
      </div>
    </div>
  `;
  
  // Crear tabla de items
  const itemsContent = `
    <div class="section no-break">
      <div class="section-title">Items</div>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Precio Unit.</th>
            <th>Subtotal</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          ${orden.items.map(item => `
            <tr>
              <td>${item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}</td>
              <td>${item.cantidad}</td>
              <td>$${(item.precio || 0).toFixed(2)}</td>
              <td>$${((item.cantidad * (item.precio || 0))).toFixed(2)}</td>
              <td>
                ${item.color ? `Color: ${item.color}<br>` : ''}
                ${item.talla ? `Talla: ${item.talla}<br>` : ''}
                ${item.impresionFrente || item.impresionAtras ? 
                  `Impresión: ${item.impresionFrente ? 'Frente' : ''}${
                    item.impresionFrente && item.impresionAtras ? ' y ' : ''
                  }${item.impresionAtras ? 'Atrás' : ''}<br>` : ''}
                ${item.descripcion ? item.descripcion : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  
  // Crear contenido de especificaciones
  const especificacionesContent = `
    <div class="section">
      <div class="section-title">Especificaciones</div>
      <p style="white-space: pre-line; font-size: 9pt;">
        ${orden.especificaciones || 'Sin especificaciones adicionales'}
      </p>
    </div>
  `;
  
  // Crear resumen de pago
  const pagoContent = `
    <div class="payment-summary">
      <div class="section-title">Resumen de Pago</div>
      <div class="detail">
        <span class="detail-label">Subtotal:</span>
        <strong>$${orden.subtotal.toFixed(2)}</strong>
      </div>
      <div class="detail">
        <span class="detail-label">Impuesto (8.53%):</span>
        <strong>$${orden.impuesto.toFixed(2)}</strong>
      </div>
      <div class="detail">
        <span class="detail-label">Total:</span>
        <strong>$${orden.total.toFixed(2)}</strong>
      </div>
      <div class="detail">
        <span class="detail-label">Anticipo:</span>
        <strong>$${orden.anticipo.toFixed(2)}</strong>
      </div>
      <div class="detail">
        <span class="detail-label">Saldo:</span>
        <strong>$${orden.saldo.toFixed(2)}</strong>
      </div>
      <div class="detail">
        <span class="detail-label">Forma de Pago:</span>
        <strong>${orden.formaPago}</strong>
      </div>
    </div>
  `;
  
  // Crear sección de firmas
  const firmasContent = `
    <div class="signatures">
      <div class="signature">
        <div class="signature-line">Firma del Cliente</div>
        <div style="font-size: 9pt; color: #666;">
          ${orden.cliente.nombre}
        </div>
      </div>
      <div class="signature">
        <div class="signature-line">Firma del Representante</div>
        <div style="font-size: 9pt; color: #666;">
          ${empresaInfo.nombre || 'Representante Legal'}
        </div>
      </div>
    </div>
  `;
  
  // Combinar todo el contenido
  const pageContent = `
    ${headerContent}
    ${clienteContent}
    ${itemsContent}
    ${especificacionesContent}
    ${pagoContent}
    ${firmasContent}
  `;
  
  // Agregar página
  addPage(printWindow, pageContent, true);
  
  // Cerrar el documento
  printWindow.document.close();
};
</script>

<template>
  <div class="glass-section">
    <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
      {{ isEditing ? 'Editar Orden de Trabajo' : 'Nueva Orden de Trabajo' }}
    </h2>

    <!-- Información del Cliente -->
    <div class="glass rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">Información del Cliente</h3>
      
      <!-- Búsqueda de clientes -->
      <div class="mb-4 relative">
        <input 
          v-model="clienteBusqueda"
          type="text"
          class="glass-input w-full"
          placeholder="Buscar cliente por nombre, email o teléfono..."
          @focus="mostrarClientesGuardados = true"
        >
        
        <!-- Lista de clientes encontrados -->
        <div v-if="mostrarClientesGuardados && clientesFiltrados.length > 0"
             class="absolute z-50 left-0 right-0 mt-2 bg-white rounded-lg shadow-xl max-h-60 overflow-y-auto">
          <div v-for="cliente in clientesFiltrados" 
               :key="cliente.email || cliente.telefono"
               @click="seleccionarCliente(cliente)"
               class="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0">
            <div class="font-medium">{{ cliente.nombre }}</div>
            <div class="text-sm text-gray-600">
              {{ cliente.email }} | {{ cliente.telefono }}
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input 
            v-model="orden.cliente!.nombre"
            type="text"
            class="glass-input w-full"
            placeholder="Nombre del cliente"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            v-model="orden.cliente!.email"
            type="email"
            class="glass-input w-full"
            placeholder="correo@ejemplo.com"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input 
            v-model="orden.cliente!.telefono"
            type="tel"
            class="glass-input w-full"
            placeholder="Teléfono de contacto"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <input 
            v-model="orden.cliente!.direccion"
            type="text"
            class="glass-input w-full"
            placeholder="Dirección completa"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
          <input 
            v-model="orden.cliente!.ciudad"
            type="text"
            class="glass-input w-full"
            placeholder="Ciudad"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
          <input 
            v-model="orden.cliente!.codigoPostal"
            type="text"
            class="glass-input w-full"
            placeholder="Código Postal"
          >
        </div>
      </div>
    </div>

    <!-- Nuevo Item -->
    <div class="glass rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">
        {{ editandoItem ? 'Editar Item' : 'Nuevo Item' }}
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select 
            v-model="nuevoItem.tipo"
            class="glass-input w-full"
          >
            <option value="camiseta">Camiseta</option>
            <option value="hoodie">Hoodie</option>
            <option value="gorra">Gorra</option>
            <option value="taza">Taza</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        
        <div v-if="['camiseta', 'hoodie'].includes(nuevoItem.tipo!)">
          <label class="block text-sm font-medium text-gray-700 mb-1">Talla</label>
          <select 
            v-model="nuevoItem.talla"
            class="glass-input w-full"
          >
            <option v-for="talla in tallas" :key="talla" :value="talla">
              {{ talla }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <select 
            v-model="nuevoItem.color"
            class="glass-input w-full"
          >
            <option v-for="color in colores" :key="color" :value="color">
              {{ color }}
            </option>
          </select>
        </div>
      </div>

      <!-- Color personalizado -->
      <div v-if="mostrarColorPersonalizado" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Color Personalizado</label>
        <input 
          v-model="colorPersonalizado"
          type="text"
          class="glass-input w-full"
          placeholder="Especifique el color (ej: Azul marino, Rosa pastel, etc.)"
        >
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
          <input 
            v-model="nuevoItem.cantidad"
            type="number"
            min="1"
            class="glass-input w-full"
          >
        </div>
        
        <div v-if="['camiseta', 'hoodie', 'gorra'].includes(nuevoItem.tipo!)">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Impresión</label>
          <select 
            v-model="nuevoItem.tipoImpresion"
            class="glass-input w-full"
          >
            <option v-for="tipo in tiposImpresion" :key="tipo" :value="tipo">
              {{ tipo }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Precio Unitario</label>
          <input  v-model="nuevoItem.precio"
            type="number"
            min="0"
            step="0.01"
            class="glass-input w-full"
            placeholder="Precio por unidad"
          >
        </div>
      </div>

      <div v-if="['camiseta', 'hoodie'].includes(nuevoItem.tipo!)" class="flex gap-4 mb-4">
        <label class="flex items-center gap-2">
          <input 
            v-model="nuevoItem.impresionFrente"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="text-sm font-medium text-gray-700">Impresión Frente</span>
        </label>
        <label class="flex items-center gap-2">
          <input 
            v-model="nuevoItem.impresionAtras"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="text-sm font-medium text-gray-700">Impresión Atrás</span>
        </label>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          v-model="nuevoItem.descripcion"
          class="glass-input w-full"
          rows="3"
          placeholder="Detalles adicionales del item..."
        ></textarea>
      </div>

      <div class="flex gap-4">
        <button 
          v-if="editandoItem"
          @click="cancelarEdicion"
          class="glass-button flex-1"
        >
          Cancelar
        </button>
        <button 
          v-if="editandoItem"
          @click="actualizarItem"
          class="glass-button-primary flex-1"
        >
          Actualizar Item
        </button>
        <button 
          v-else
          @click="agregarItem"
          class="glass-button-primary w-full"
        >
          Agregar Item
        </button>
      </div>
    </div>

    <!-- Lista de Items -->
    <div v-if="orden.items?.length" class="glass rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">Items Agregados</h3>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unit.</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in orden.items" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-4 whitespace-nowrap">
                {{ item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1) }}
              </td>
              <td class="px-4 py-4">
                <div v-if="item.color">Color: {{ item.color }}</div>
                <div v-if="item.talla">Talla: {{ item.talla }}</div>
                <div v-if="item.tipoImpresion">
                  {{ item.tipoImpresion }}
                  <span v-if="item.impresionFrente || item.impresionAtras">
                    ({{ item.impresionFrente ? 'Frente' : '' }}
                    {{ item.impresionFrente && item.impresionAtras ? ' y ' : '' }}
                    {{ item.impresionAtras ? 'Atrás' : '' }})
                  </span>
                </div>
                <div v-if="item.descripcion" class="text-gray-500 text-sm mt-1">
                  {{ item.descripcion }}
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                {{ item.cantidad }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                ${{ (item.precio || 0).toFixed(2) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap font-medium">
                ${{ ((item.precio || 0) * item.cantidad).toFixed(2) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-right">
                <button 
                  @click="iniciarEdicionItem(item)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button 
                  @click="eliminarItem(item.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Especificaciones -->
    <div class="glass rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">Especificaciones</h3>
      <textarea 
        v-model="orden.especificaciones"
        rows="4"
        class="glass-input w-full"
        placeholder="Detalles específicos del trabajo..."
      ></textarea>
    </div>

    <!-- Prioridad y Estado -->
    <div class="glass rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">Prioridad y Estado</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
          <select v-model="orden.prioridad" class="glass-input w-full">
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select v-model="orden.estado" class="glass-input w-full">
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En Proceso</option>
            <option value="completado">Completado</option>
            <option value="entregado">Entregado</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Información de Pago -->
    <div class="glass rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">Información de Pago</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Subtotal</label>
          <input 
            v-model="orden.subtotal"
            type="number"
            min="0"
            step="0.01"
            class="glass-input w-full"
            :readonly="orden.items && orden.items.length > 0"
            :class="{ 'bg-gray-50': orden.items && orden.items.length > 0 }"
          >
          <p v-if="orden.items && orden.items.length > 0" class="text-xs text-gray-500 mt-1">
            El subtotal se calcula automáticamente basado en los items
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Impuesto (8.53%)</label>
          <input 
            v-model="orden.impuesto"
            type="number"
            readonly
            class="glass-input w-full bg-gray-50"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Total</label>
          <input 
            v-model="orden.total"
            type="number"
            readonly
            class="glass-input w-full bg-gray-50"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Anticipo</label>
          <input 
            v-model="orden.anticipo"
            type="number"
            min="0"
            step="0.01"
            class="glass-input w-full"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Saldo</label>
          <input 
            v-model="orden.saldo"
            type="number"
            readonly
            class="glass-input w-full bg-gray-50"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Forma de Pago</label>
          <select v-model="orden.formaPago" class="glass-input w-full">
            <option value="efectivo">Efectivo</option>
            <option value="cheque">Cheque</option>
            <option value="credito">Tarjeta de Crédito</option>
            <option value="debito">Tarjeta de Débito</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Botón de Guardar -->
    <div class="flex justify-end">
      <button 
        @click="guardarOrden"
        class="glass-button-success text-lg px-8 py-3">
        {{ isEditing ? 'Actualizar e Imprimir Orden' : 'Guardar e Imprimir Orden' }}
      </button>
    </div>
  </div>
</template>