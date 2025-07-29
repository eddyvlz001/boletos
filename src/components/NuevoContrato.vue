<template>
  <div class="nuevo-contrato">
    <div class="header">
      <h1>{{ isEditing ? 'Editar Contrato' : 'Nuevo Contrato' }}</h1>
    </div>

    <!-- Información del Cliente -->
    <div class="section">
      <h2>Información del Cliente</h2>
      <div class="form-grid">
        <div class="form-group">
          <label>Nombre:</label>
          <input v-model="contrato.cliente.nombre" type="text" placeholder="Nombre completo">
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input v-model="contrato.cliente.email" type="email" placeholder="correo@ejemplo.com">
        </div>
        <div class="form-group">
          <label>Teléfono:</label>
          <input v-model="contrato.cliente.telefono" type="tel" placeholder="Teléfono">
        </div>
        <div class="form-group">
          <label>Dirección:</label>
          <input v-model="contrato.cliente.direccion" type="text" placeholder="Dirección completa">
        </div>
        <div class="form-group">
          <label>Ciudad:</label>
          <input v-model="contrato.cliente.ciudad" type="text" placeholder="Ciudad">
        </div>
        <div class="form-group">
          <label>Código Postal:</label>
          <input v-model="contrato.cliente.codigoPostal" type="text" placeholder="CP">
        </div>
      </div>
    </div>

    <!-- Tipo de Evento -->
    <div class="section">
      <h2>Tipo de Evento</h2>
      <div class="event-types">
        <button 
          v-for="tipo in tiposEventoBase" 
          :key="tipo.id"
          @click="actualizarDetalles(tipo.id)"
          :class="{ active: contrato.evento?.tipo === tipo.id }"
          class="event-type-btn"
        >
          <span class="icon">{{ tipo.icono }}</span>
          <span>{{ tipo.nombre }}</span>
        </button>
      </div>
    </div>

    <!-- Detalles del Evento -->
    <div class="section">
      <div class="section-header">
        <h2>Detalles del Evento</h2>
        <button @click="editingDetalles = !editingDetalles" class="btn-secondary">
          {{ editingDetalles ? 'Guardar' : 'Personalizar' }}
        </button>
      </div>

      <div v-if="editingDetalles" class="detalles-editor">
        <h3>Personalizar detalles para {{ tiposEventoBase.find(t => t.id === contrato.evento?.tipo)?.nombre }}</h3>
        <div class="predefined-details">
          <div v-for="(detalle, index) in detallesPredefinidos[contrato.evento?.tipo || 'boda']" :key="index" class="detail-item">
            <input v-model="detallesPredefinidos[contrato.evento?.tipo || 'boda'][index]" type="text">
            <button @click="eliminarDetallePredefinido(contrato.evento?.tipo || 'boda', index)" class="btn-danger">×</button>
          </div>
        </div>
        <div class="add-detail">
          <input v-model="nuevoDetalleEspecifico" @keyup.enter="agregarDetalleEspecifico" type="text" placeholder="Nuevo detalle">
          <button @click="agregarDetalleEspecifico" class="btn-primary">Agregar</button>
        </div>
        <button @click="guardarDetallesPredefinidos" class="btn-success">Guardar Cambios</button>
      </div>

      <div class="detalles-form">
        <div v-for="(detalle, index) in detallesActuales" :key="detalle.id" class="detail-row">
          <label>{{ detalle.nombre }}:</label>
          <input v-model="detalle.valor" type="text" :placeholder="detalle.nombre">
          <div class="detail-actions">
            <button @click="moverDetalle(index, 'arriba')" :disabled="index === 0" class="btn-move">↑</button>
            <button @click="moverDetalle(index, 'abajo')" :disabled="index === detallesActuales.length - 1" class="btn-move">↓</button>
            <button @click="eliminarDetalle(detalle.id)" class="btn-danger">×</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Servicios -->
    <div class="section">
      <div class="section-header">
        <h2>Servicios</h2>
        <button @click="servicioActivo = true" class="btn-primary">Agregar Servicio</button>
      </div>
      
      <div v-if="contrato.servicios && contrato.servicios.length > 0" class="servicios-list">
        <div v-for="servicio in contrato.servicios" :key="servicio.id" class="servicio-item">
          <h3>{{ servicio.nombre }}</h3>
          <p>{{ servicio.descripcion }}</p>
          <span class="precio">${{ servicio.precio }}</span>
        </div>
      </div>
    </div>

    <!-- Sección de Pago -->
    <SeccionPago 
      :servicios="contrato.servicios || []"
      @pago-actualizado="onPagoActualizado"
    />

    <!-- Notas -->
    <div class="section">
      <div class="section-header">
        <h2>Notas y Términos</h2>
        <button @click="toggleNotasEditing" class="btn-secondary">
          {{ editingNotas ? 'Guardar' : 'Editar' }}
        </button>
      </div>
      
      <div v-if="editingNotas" class="notas-editor">
        <textarea v-model="contrato.notas" rows="6" placeholder="Notas adicionales, términos y condiciones..."></textarea>
        <button @click="guardarNotas" class="btn-success">Guardar Notas</button>
      </div>
      <div v-else class="notas-display">
        <p v-if="contrato.notas">{{ contrato.notas }}</p>
        <p v-else class="placeholder">No hay notas adicionales</p>
      </div>
    </div>

    <!-- Botones de Acción -->
    <div class="actions">
      <button @click="guardarContrato" class="btn-success">
        {{ isEditing ? 'Actualizar Contrato' : 'Guardar Contrato' }}
      </button>
      <button @click="$router.push('/dashboard')" class="btn-secondary">Cancelar</button>
    </div>

    <!-- Modal de Servicios -->
    <NuevoServicio 
      v-if="servicioActivo"
      @servicio-creado="onServicioCreado"
      @cerrar="servicioActivo = false"
    />

    <!-- Modal de Impresión -->
    <div v-if="mostrarModalImpresion" class="modal-overlay">
      <div class="modal">
        <h3>Contrato Guardado</h3>
        <p>El contrato ha sido guardado exitosamente.</p>
        <div class="modal-actions">
          <button @click="imprimirContrato" class="btn-primary">Imprimir</button>
          <button @click="mostrarModalImpresion = false; $router.push('/dashboard')" class="btn-secondary">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { Contrato, TipoEvento, DetalleEspecifico } from '../types';
import NuevoServicio from './NuevoServicio.vue';
import SeccionPago from './SeccionPago.vue';
import { createPrintWindow, addPage, createItemsTable, formatCurrency, formatDate } from '../utils/printingUtils';

const route = useRoute();
const isEditing = computed(() => route.query.editar === 'true');

const editingDetalles = ref(false);
const detallesPredefinidos = ref<Record<string, string[]>>({
  boda: [
    'Nombre del novio',
    'Nombre de la novia',
    'Ceremonia religiosa',
    'Hora de ceremonia',
    'Lugar de ceremonia'
  ],
  quinceanos: [
    'Nombre de la quinceañera',
    'Tipo de misa/ceremonia',
    'Número de chambelanes',
    'Vals principal'
  ],
  bautizo: [
    'Nombre del bebé',
    'Nombre de los padres',
    'Nombre de los padrinos',
    'Iglesia'
  ],
  graduacion: [
    'Nombre del graduado',
    'Institución',
    'Grado/Título obtenido'
  ],
  cumpleanos: [
    'Nombre del festejado',
    'Edad a cumplir',
    'Tema de la fiesta'
  ]
});

const detallesBase = [
  'Fecha del evento',
  'Hora de inicio',
  'Hora de fin',
  'Lugar del evento',
  'Número de invitados'
];

const editingNotas = ref(false);
const servicioActivo = ref(false);
const mostrarModalImpresion = ref(false);

// Tipos de evento disponibles con iconos
const tiposEventoBase = [
  { id: 'boda', nombre: 'Boda', icono: '💒' },
  { id: 'quinceanos', nombre: 'Quinceaños', icono: '👗' },
  { id: 'bautizo', nombre: 'Bautizo', icono: '👶' },
  { id: 'graduacion', nombre: 'Graduación', icono: '🎓' },
  { id: 'cumpleanos', nombre: 'Cumpleaños', icono: '🎂' }
];

// Estado para detalles del evento
const detallesActuales = ref<DetalleEspecifico[]>([]);
const nuevoDetalleEspecifico = ref('');

// Initialization of the contract
const contrato = ref<Partial<Contrato>>({
  cliente: {
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: ''
  },
  evento: {
    tipo: 'boda',
    detallesEspecificos: []
  },
  servicios: [],
  items: [],
  notas: ''
});

const clienteBusqueda = ref('');
const mostrarClientesGuardados = ref(false);
const clientesFiltrados = ref([]);

// Cargar detalles predefinidos guardados
onMounted(() => {
  const detallesGuardados = localStorage.getItem('detallesPredefinidos');
  if (detallesGuardados) {
    detallesPredefinidos.value = JSON.parse(detallesGuardados);
  }
  
  // Si estamos editando, cargar el contrato
  if (isEditing.value) {
    const contratoEditar = localStorage.getItem('contratoEditar');
    if (contratoEditar) {
      const contratoData = JSON.parse(contratoEditar);
      contrato.value = contratoData;
      
      // Cargar detalles específicos
      if (contratoData.evento && contratoData.evento.detallesEspecificos) {
        detallesActuales.value = contratoData.evento.detallesEspecificos;
      } else {
        actualizarDetalles(contratoData.evento?.tipo || 'boda');
      }
    }
  } else {
    actualizarDetalles('boda');
  }
});

// Guardar detalles predefinidos
const guardarDetallesPredefinidos = () => {
  localStorage.setItem('detallesPredefinidos', JSON.stringify(detallesPredefinidos.value));
  editingDetalles.value = false;
};

// Agregar detalle predefinido a un tipo de evento
const agregarDetallePredefinido = (tipo: string, detalle: string) => {
  if (!detallesPredefinidos.value[tipo]) {
    detallesPredefinidos.value[tipo] = [];
  }
  detallesPredefinidos.value[tipo].push(detalle);
};

// Eliminar detalle predefinido
const eliminarDetallePredefinido = (tipo: string, index: number) => {
  detallesPredefinidos.value[tipo].splice(index, 1);
};

// Función para actualizar detalles según el tipo de evento
const actualizarDetalles = (tipo: TipoEvento) => {
  if (contrato.value.evento) {
    contrato.value.evento.tipo = tipo;
  }

  // Combinar detalles base con específicos
  const detallesEspecificos = detallesPredefinidos.value[tipo] || [];
  const todosLosDetalles = [...detallesBase, ...detallesEspecificos];

  // Convertir a formato DetalleEspecifico
  detallesActuales.value = todosLosDetalles.map(nombre => ({
    id: crypto.randomUUID(),
    nombre,
    valor: ''
  }));
};

const seleccionarCliente = (cliente: any) => {
  contrato.value.cliente = cliente;
  mostrarClientesGuardados.value = false;
  clienteBusqueda.value = '';
};

// Función para mover detalles arriba/abajo
const moverDetalle = (index: number, direccion: 'arriba' | 'abajo') => {
  if (direccion === 'arriba' && index > 0) {
    const temp = detallesActuales.value[index];
    detallesActuales.value[index] = detallesActuales.value[index - 1];
    detallesActuales.value[index - 1] = temp;
  } else if (direccion === 'abajo' && index < detallesActuales.value.length - 1) {
    const temp = detallesActuales.value[index];
    detallesActuales.value[index] = detallesActuales.value[index + 1];
    detallesActuales.value[index + 1] = temp;
  }
};

// Función para eliminar detalle
const eliminarDetalle = (id: string) => {
  detallesActuales.value = detallesActuales.value.filter(d => d.id !== id);
};

const agregarDetalleEspecifico = () => {
  if (nuevoDetalleEspecifico.value.trim()) {
    const detalle: DetalleEspecifico = {
      id: crypto.randomUUID(),
      nombre: nuevoDetalleEspecifico.value,
      valor: ''
    };
    detallesActuales.value.push(detalle);
    nuevoDetalleEspecifico.value = '';
  }
};

const onServicioCreado = (servicio: any) => {
  contrato.value.servicios = [...(contrato.value.servicios || []), servicio];
  servicioActivo.value = false;
};

const onPagoActualizado = (pago: any) => {
  if (contrato.value) {
    contrato.value.total = pago.total;
    contrato.value.anticipo = pago.abono;
    contrato.value.saldo = pago.saldo;
    contrato.value.formaPago = pago.formaPago;
  }
};

// Add function to toggle notes editing
const toggleNotasEditing = () => {
  editingNotas.value = !editingNotas.value;
};

// Add function to save notes
const guardarNotas = () => {
  editingNotas.value = false;
};

// Función para guardar el contrato
const guardarContrato = () => {
  // Crear el contrato completo
  const contratoCompleto: Contrato = {
    id: contrato.value.id || crypto.randomUUID(),
    numeroContrato: contrato.value.numeroContrato || `CONT-${Date.now()}`,
    fecha: contrato.value.fecha || new Date(),
    cliente: contrato.value.cliente!,
    evento: {
      titulo: contrato.value.evento?.tipo || 'Sin título',
      tipo: contrato.value.evento?.tipo || 'otro',
      fecha: contrato.value.evento?.fecha || new Date(),
      ubicacion: contrato.value.evento?.ubicacion || '',
      horaInicio: contrato.value.evento?.horaInicio || '',
      horaFin: contrato.value.evento?.horaFin || '',
      numeroInvitados: contrato.value.evento?.numeroInvitados || 0,
      detallesEspecificos: detallesActuales.value
    },
    servicios: contrato.value.servicios || [],
    items: contrato.value.items || [],
    total: contrato.value.total || 0,
    anticipo: contrato.value.anticipo || 0,
    saldo: contrato.value.saldo || 0,
    formaPago: contrato.value.formaPago || 'efectivo',
    estado: contrato.value.estado || 'pendiente',
    notas: contrato.value.notas || ''
  };

  // Guardar en localStorage
  const contratos = JSON.parse(localStorage.getItem('contratos') || '[]');
  
  if (isEditing.value) {
    // Si estamos editando, actualizar el contrato existente
    const index = contratos.findIndex((c: Contrato) => c.id === contratoCompleto.id);
    if (index !== -1) {
      contratos[index] = contratoCompleto;
    } else {
      contratos.push(contratoCompleto);
    }
  } else {
    // Si es nuevo, agregarlo al array
    contratos.push(contratoCompleto);
  }
  
  localStorage.setItem('contratos', JSON.stringify(contratos));
  localStorage.removeItem('contratoEditar'); // Limpiar el contrato en edición

  // Mostrar modal de impresión
  mostrarModalImpresion.value = true;
};

// Función para imprimir contrato usando la nueva librería
const imprimirContrato = () => {
  // Obtener información de la empresa
  const empresaInfo = JSON.parse(localStorage.getItem('informacionEmpresa') || '{}');
  
  // Crear ventana de impresión
  const printWindow = createPrintWindow({
    title: `Contrato #${contrato.value.numeroContrato || 'NUEVO'}`,
    pageSize: 'letter'
  });
  
  if (!printWindow) return;
  
  // Crear contenido de la primera página
  const headerContent = `
    <div class="header">
      <div class="company-info">
        ${empresaInfo.logo ? `
          <div class="logo-container">
            <img src="${empresaInfo.logo}" alt="Logo">
          </div>
        ` : ''}
        <div class="company-details">
          ${empresaInfo.nombre ? `<h2>${empresaInfo.nombre}</h2>` : ''}
          ${empresaInfo.direccion ? `<p>${empresaInfo.direccion}</p>` : ''}
          ${empresaInfo.telefono ? `<p>Tel: ${empresaInfo.telefono}</p>` : ''}
          ${empresaInfo.email ? `<p>${empresaInfo.email}</p>` : ''}
        </div>
      </div>
      <div class="contract-number">
        Contrato de Evento #${contrato.value.numeroContrato || 'NUEVO'}
      </div>
      <p>Fecha: ${new Date().toLocaleDateString()}</p>
    </div>
  `;
  
  const clienteContent = `
    <div class="section">
      <div class="section-title">Información del Cliente</div>
      <div class="grid">
        <div class="detail">
          <span class="detail-label">Nombre:</span>
          <span>${contrato.value.cliente?.nombre}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Email:</span>
          <span>${contrato.value.cliente?.email}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Teléfono:</span>
          <span>${contrato.value.cliente?.telefono}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Dirección:</span>
          <span>${contrato.value.cliente?.direccion}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Ciudad:</span>
          <span>${contrato.value.cliente?.ciudad}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Código Postal:</span>
          <span>${contrato.value.cliente?.codigoPostal}</span>
        </div>
      </div>
    </div>
  `;
  
  const detallesContent = `
    <div class="section">
      <div class="section-title">Detalles del Evento</div>
      <div class="grid">
        ${detallesActuales.value.map(detalle => `
          <div class="detail">
            <span class="detail-label">${detalle.nombre}:</span>
            <span>${detalle.valor}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  let serviciosContent = '';
  if (contrato.value.servicios && contrato.value.servicios.length > 0) {
    serviciosContent = `
      <div class="section no-break">
        <div class="section-title">Servicios Contratados</div>
        <table class="services-table">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Descripción</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            ${contrato.value.servicios.map(servicio => `
              <tr>
                <td>${servicio.nombre}</td>
                <td>${servicio.descripcion}</td>
                <td>$${servicio.precio}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  
  const pagoContent = `
    <div class="payment-summary">
      <div class="section-title">Resumen de Pago</div>
      <div class="detail">
        <span class="detail-label">Total:</span>
        <strong>$${contrato.value.total?.toFixed(2)}</strong>
      </div>
      <div class="detail">
        <span class="detail-label">Anticipo:</span>
        <strong>$${contrato.value.anticipo?.toFixed(2)}</strong>
      </div>
      <div class="detail">
        <span class="detail-label">Saldo:</span>
        <strong>$${contrato.value.saldo?.toFixed(2)}</strong>
      </div>
      <div class="detail">
        <span class="detail-label">Forma de Pago:</span>
        <strong>${contrato.value.formaPago}</strong>
      </div>
    </div>
  `;
  
  // Contenido de la primera página
  const firstPageContent = `
    ${headerContent}
    ${clienteContent}
    ${detallesContent}
    ${serviciosContent}
    ${pagoContent}
  `;
  
  // Agregar primera página
  addPage(printWindow, firstPageContent);
  
  // Contenido de la segunda página (notas y firmas)
  let notasContent = '';
  if (contrato.value.notas) {
    notasContent = `
      <div class="section">
        <div class="section-title">Notas y Términos</div>
        <div class="notes">${contrato.value.notas}</div>
      </div>
    `;
  }
  
  const firmasContent = `
    <div class="signatures">
      <div class="signature-section">
        <div class="signature-line"></div>
        <p>Firma del Cliente</p>
        <p>${contrato.value.cliente?.nombre}</p>
      </div>
      <div class="signature-section">
        <div class="signature-line"></div>
        <p>Firma del Proveedor</p>
        <p>${empresaInfo.nombre || 'Empresa'}</p>
      </div>
    </div>
  `;
  
  const secondPageContent = `
    ${notasContent}
    ${firmasContent}
  `;
  
  // Agregar segunda página
  addPage(printWindow, secondPageContent);
  
  // Imprimir
  printWindow.print();
  printWindow.close();
  
  mostrarModalImpresion.value = false;
};
</script>

<style scoped>
.nuevo-contrato {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section h2 {
  color: #34495e;
  margin-bottom: 15px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #2c3e50;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.event-types {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.event-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.event-type-btn:hover {
  border-color: #3498db;
  transform: translateY(-2px);
}

.event-type-btn.active {
  border-color: #3498db;
  background: #e3f2fd;
}

.event-type-btn .icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.detalles-form {
  display: grid;
  gap: 15px;
}

.detail-row {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  gap: 10px;
  align-items: center;
}

.detail-row label {
  font-weight: bold;
  color: #2c3e50;
}

.detail-row input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.detail-actions {
  display: flex;
  gap: 5px;
}

.btn-move {
  padding: 5px 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 3px;
  cursor: pointer;
}

.btn-move:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.servicios-list {
  display: grid;
  gap: 15px;
}

.servicio-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: #f8f9fa;
}

.servicio-item h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.servicio-item p {
  margin: 0 0 10px 0;
  color: #666;
}

.precio {
  font-weight: bold;
  color: #27ae60;
  font-size: 18px;
}

.notas-editor textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
}

.notas-display {
  min-height: 60px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.placeholder {
  color: #999;
  font-style: italic;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.btn-primary {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.btn-success {
  background: #27ae60;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-success:hover {
  background: #229954;
}

.btn-danger {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.btn-danger:hover {
  background: #c0392b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.detalles-editor {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.predefined-details {
  display: grid;
  gap: 10px;
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.detail-item input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-detail {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.add-detail input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>