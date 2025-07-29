<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createPrintWindow, addPage, createItemsTable, formatCurrency, formatDate } from '../utils/printingUtils';
import type { OrdenTrabajo } from '../types';

const props = defineProps<{
  orden: OrdenTrabajo;
  empresaInfo?: any;
}>();

const printDocument = () => {
  // Get company info
  const empresaInfo = props.empresaInfo || JSON.parse(localStorage.getItem('informacionEmpresa') || '{}');
  
  // Create print window
  const printWindow = createPrintWindow({
    title: `Orden de Trabajo #${props.orden.numeroOrden}`,
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
        Orden de Trabajo #${props.orden.numeroOrden}
      </div>
      <div style="margin-top: 10px;">
        <span style="display: inline-block; padding: 3px 8px; border-radius: 3px; font-weight: bold; text-transform: uppercase; font-size: 8pt; 
          ${props.orden.prioridad === 'baja' ? 'background: #dbeafe; color: #1e40af;' : 
          props.orden.prioridad === 'media' ? 'background: #fef3c7; color: #92400e;' :
          props.orden.prioridad === 'alta' ? 'background: #fee2e2; color: #991b1b;' :
          'background: #dc2626; color: white;'}">
          Prioridad: ${props.orden.prioridad}
        </span>
      </div>
      <p>Fecha: ${formatDate(props.orden.fecha)}</p>
    </div>
  `;
  
  // Create client information section
  const clienteContent = `
    <div class="section">
      <div class="section-title">Información del Cliente</div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        <div style="margin-bottom: 5px; font-size: 9pt;">
          <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 100px;">Nombre:</span>
          <span>${props.orden.cliente.nombre}</span>
        </div>
        <div style="margin-bottom: 5px; font-size: 9pt;">
          <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 100px;">Email:</span>
          <span>${props.orden.cliente.email}</span>
        </div>
        <div style="margin-bottom: 5px; font-size: 9pt;">
          <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 100px;">Teléfono:</span>
          <span>${props.orden.cliente.telefono}</span>
        </div>
        <div style="margin-bottom: 5px; font-size: 9pt;">
          <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 100px;">Dirección:</span>
          <span>${props.orden.cliente.direccion}</span>
        </div>
        <div style="margin-bottom: 5px; font-size: 9pt;">
          <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 100px;">Ciudad:</span>
          <span>${props.orden.cliente.ciudad}</span>
        </div>
        <div style="margin-bottom: 5px; font-size: 9pt;">
          <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 100px;">Código Postal:</span>
          <span>${props.orden.cliente.codigoPostal}</span>
        </div>
      </div>
    </div>
  `;
  
  // Create items section
  const itemsContent = `
    <div class="section no-break">
      <div class="section-title">Items</div>
      <table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt;">
        <thead>
          <tr>
            <th style="border: 1px solid #e5e7eb; padding: 5px; text-align: left; background: #f8fafc; font-weight: 600;">Tipo</th>
            <th style="border: 1px solid #e5e7eb; padding: 5px; text-align: left; background: #f8fafc; font-weight: 600;">Cantidad</th>
            <th style="border: 1px solid #e5e7eb; padding: 5px; text-align: left; background: #f8fafc; font-weight: 600;">Precio Unit.</th>
            <th style="border: 1px solid #e5e7eb; padding: 5px; text-align: left; background: #f8fafc; font-weight: 600;">Subtotal</th>
            <th style="border: 1px solid #e5e7eb; padding: 5px; text-align: left; background: #f8fafc; font-weight: 600;">Detalles</th>
          </tr>
        </thead>
        <tbody>
          ${props.orden.items.map(item => `
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 5px; text-align: left;">${item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}</td>
              <td style="border: 1px solid #e5e7eb; padding: 5px; text-align: left;">${item.cantidad}</td>
              <td style="border: 1px solid #e5e7eb; padding: 5px; text-align: left;">${formatCurrency(item.precio || 0)}</td>
              <td style="border: 1px solid #e5e7eb; padding: 5px; text-align: left;">${formatCurrency((item.cantidad * (item.precio || 0)))}</td>
              <td style="border: 1px solid #e5e7eb; padding: 5px; text-align: left;">
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
  
  // Create specifications section
  const especificacionesContent = `
    <div class="section">
      <div class="section-title">Especificaciones</div>
      <p style="white-space: pre-line; font-size: 9pt;">
        ${props.orden.especificaciones || 'Sin especificaciones adicionales'}
      </p>
    </div>
  `;
  
  // Create payment summary section
  const pagoContent = `
    <div class="section" style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin-top: 15px;">
      <div class="section-title">Resumen de Pago</div>
      <div style="margin-bottom: 5px; font-size: 9pt;">
        <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 100px;">Subtotal:</span>
        <strong>${formatCurrency(props.orden.subtotal)}</strong>
      </div>
      <div style="margin-bottom: 5px; font-size: 9pt;">
        <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 100px;">Impuesto (8.53%):</span>
        <strong>${formatCurrency(props.orden.impuesto)}</strong>
      </div>
      <div style="margin-bottom: 5px; font-size: 9pt;">
        <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 100px;">Total:</span>
        <strong>${formatCurrency(props.orden.total)}</strong>
      </div>
      <div style="margin-bottom: 5px; font-size: 9pt;">
        <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 100px;">Anticipo:</span>
        <strong>${formatCurrency(props.orden.anticipo)}</strong>
      </div>
      <div style="margin-bottom: 5px; font-size: 9pt;">
        <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 100px;">Saldo:</span>
        <strong>${formatCurrency(props.orden.saldo)}</strong>
      </div>
      <div style="margin-bottom: 5px; font-size: 9pt;">
        <span style="font-weight: 600; color: #4b5563; display: inline-block; width: 100px;">Forma de Pago:</span>
        <strong>${props.orden.formaPago}</strong>
      </div>
    </div>
  `;
  
  // Create signatures section
  const firmasContent = `
    <div class="signatures">
      <div class="signature">
        <div class="signature-line">Firma del Cliente</div>
        <div style="font-size: 9pt; color: #666;">
          ${props.orden.cliente.nombre}
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
  
  // Combine all content for the page
  const pageContent = `
    ${headerContent}
    ${clienteContent}
    ${itemsContent}
    ${especificacionesContent}
    ${pagoContent}
    ${firmasContent}
  `;
  
  // Add page
  addPage(printWindow, pageContent, true);
  
  // Close the document
  printWindow.document.close();
};

// Auto-print when component is mounted
onMounted(() => {
  if (props.orden) {
    printDocument();
  }
});
</script>

<template>
  <div>
    <button @click="printDocument" class="glass-button-primary">
      Imprimir Orden de Trabajo
    </button>
  </div>
</template>