<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createPrintWindow, addPage, createItemsTable, formatCurrency, formatDate } from '../utils/printingUtils';
import type { Contrato } from '../types';

const props = defineProps<{
  contrato: Contrato;
  empresaInfo?: any;
}>();

const printDocument = () => {
  // Get company info
  const empresaInfo = props.empresaInfo || JSON.parse(localStorage.getItem('informacionEmpresa') || '{}');
  
  // Create print window
  const printWindow = createPrintWindow({
    title: `Contrato #${props.contrato.numeroContrato}`,
    pageSize: 'letter'
  });
  
  if (!printWindow) return;
  
  // Create header content
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
        Contrato de Evento #${props.contrato.numeroContrato}
      </div>
      <p>Fecha: ${formatDate(props.contrato.fecha)}</p>
    </div>
  `;
  
  // Create client information section
  const clienteContent = `
    <div class="section">
      <div class="section-title">Información del Cliente</div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        <div style="margin-bottom: 5px; font-size: 9pt;">
          <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 120px;">Nombre:</span>
          <span>${props.contrato.cliente.nombre}</span>
        </div>
        <div style="margin-bottom: 5px; font-size: 9pt;">
          <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 120px;">Email:</span>
          <span>${props.contrato.cliente.email}</span>
        </div>
        <div style="margin-bottom: 5px; font-size: 9pt;">
          <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 120px;">Teléfono:</span>
          <span>${props.contrato.cliente.telefono}</span>
        </div>
        <div style="margin-bottom: 5px; font-size: 9pt;">
          <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 120px;">Dirección:</span>
          <span>${props.contrato.cliente.direccion}</span>
        </div>
        <div style="margin-bottom: 5px; font-size: 9pt;">
          <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 120px;">Ciudad:</span>
          <span>${props.contrato.cliente.ciudad}</span>
        </div>
        <div style="margin-bottom: 5px; font-size: 9pt;">
          <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 120px;">Código Postal:</span>
          <span>${props.contrato.cliente.codigoPostal}</span>
        </div>
      </div>
    </div>
  `;
  
  // Create event details section
  const detallesEventoContent = `
    <div class="section">
      <div class="section-title">Detalles del Evento</div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        ${props.contrato.evento.detallesEspecificos.map(detalle => `
          <div style="margin-bottom: 5px; font-size: 9pt;">
            <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 120px;">${detalle.nombre}:</span>
            <span>${detalle.valor}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Create services section if there are services
  let serviciosContent = '';
  if (props.contrato.servicios && props.contrato.servicios.length > 0) {
    const columns = [
      { key: 'nombre', label: 'Servicio' },
      { key: 'descripcion', label: 'Descripción' },
      { key: 'precio', label: 'Precio' }
    ];
    
    serviciosContent = `
      <div class="section">
        <div class="section-title">Servicios Contratados</div>
        ${createItemsTable(props.contrato.servicios, columns)}
      </div>
    `;
  }
  
  // Create payment summary section
  const pagoContent = `
    <div class="section" style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin-top: 15px;">
      <div class="section-title">Resumen de Pago</div>
      <div style="margin-bottom: 5px; font-size: 9pt;">
        <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 120px;">Total:</span>
        <strong>${formatCurrency(props.contrato.total)}</strong>
      </div>
      <div style="margin-bottom: 5px; font-size: 9pt;">
        <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 120px;">Anticipo:</span>
        <strong>${formatCurrency(props.contrato.anticipo)}</strong>
      </div>
      <div style="margin-bottom: 5px; font-size: 9pt;">
        <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 120px;">Saldo:</span>
        <strong>${formatCurrency(props.contrato.saldo)}</strong>
      </div>
      <div style="margin-bottom: 5px; font-size: 9pt;">
        <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 120px;">Forma de Pago:</span>
        <strong>${props.contrato.formaPago}</strong>
      </div>
    </div>
  `;
  
  // Create notes section if there are notes
  let notasContent = '';
  if (props.contrato.notas) {
    notasContent = `
      <div class="section">
        <div class="section-title">Notas y Términos</div>
        <div style="white-space: pre-line; font-size: 9pt;">${props.contrato.notas}</div>
      </div>
    `;
  }
  
  // Create signatures section
  const firmasContent = `
    <div class="signatures">
      <div class="signature">
        <div class="signature-line">Firma del Cliente</div>
        <div style="font-size: 9pt; color: #666;">
          ${props.contrato.cliente.nombre}
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
  
  // Combine all content for the first page
  const firstPageContent = `
    ${headerContent}
    ${clienteContent}
    ${detallesEventoContent}
    ${serviciosContent}
    ${pagoContent}
  `;
  
  // Add first page
  addPage(printWindow, firstPageContent);
  
  // Add second page if there are notes
  if (notasContent) {
    const secondPageContent = `
      ${notasContent}
      ${firmasContent}
    `;
    addPage(printWindow, secondPageContent, true);
  } else {
    // Add signatures to first page if no second page
    addPage(printWindow, firmasContent, true);
  }
  
  // Close the document
  printWindow.document.close();
};

// Auto-print when component is mounted
onMounted(() => {
  if (props.contrato) {
    printDocument();
  }
});
</script>

<template>
  <div>
    <button @click="printDocument" class="glass-button-primary">
      Imprimir Contrato
    </button>
  </div>
</template>