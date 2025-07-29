<script setup lang="ts">
import { ref, computed } from 'vue';

const numerosInicio = ref(1);
const numerosFin = ref(10);
const imagenDerecha = ref('');
const boletosPerPage = 5; // Boletos por página
const maxBoletosPerBatch = 100; // Máximo de boletos por lote para evitar congelamiento
const batchDelay = 50; // Delay entre lotes en milisegundos

const handleImagenChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        imagenDerecha.value = e.target.result as string;
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const generarSecuenciaAlterna = (inicio: number, fin: number) => {
  const total = fin - inicio + 1;
  const numPaginas = Math.ceil(total / boletosPerPage);
  const numerosOrdenados: number[][] = Array(numPaginas).fill(null).map(() => []);
  
  // Distribuir números secuencialmente
  for (let pagina = 0; pagina < numPaginas; pagina++) {
    for (let pos = 0; pos < boletosPerPage; pos++) {
      const numero = inicio + (pos * numPaginas) + pagina;
      if (numero <= fin) {
        numerosOrdenados[pagina].push(numero);
      }
    }
  }
  
  return numerosOrdenados;
};

const imprimirBoletos = () => {
  const total = numerosFin.value - numerosInicio.value + 1;
  
  if (total > 1000) {
    if (!confirm(`Está intentando generar ${total} boletos. Esto puede tomar varios minutos y usar mucha memoria. ¿Desea continuar?`)) {
      return;
    }
  }

  const ventanaImpresion = window.open('', '_blank');
  if (ventanaImpresion) {
    // Escribir el encabezado del documento
    ventanaImpresion.document.write(`
      <html>
        <head>
          <title>Boletos</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              background: white;
            }
            .page {
              width: 210mm;
              height: 297mm;
              position: relative;
              page-break-after: always;
              display: flex;
              flex-direction: column;
              padding: 0;
            }
            .ticket-container {
              height: 59.4mm;
              display: flex;
              border-bottom: 1px solid #000;
              position: relative;
              background: white;
            }
            .ticket-container:last-child {
              border-bottom: none;
            }
            .stub {
              width: 70mm;
              border-right: 1px dashed #000;
              padding: 8px;
              position: relative;
            }
            .stub::after {
              content: '✂';
              position: absolute;
              right: -8px;
              top: 50%;
              transform: translateY(-50%);
              font-size: 12pt;
              color: #666;
            }
            .ticket {
              width: 140mm;
              position: relative;
              padding: 0;
              margin: 0;
              overflow: hidden;
            }
            .field {
              margin-bottom: 6px;
            }
            .field-label {
              font-size: 7pt;
              color: #666;
              margin-bottom: 2px;
            }
            .field-value {
              border-bottom: 1px solid #ccc;
              height: 14pt;
            }
            .ticket-number {
              color: #ff0000;
              font-size: 14pt;
              font-weight: bold;
              margin-bottom: 8px;
            }
            .ticket-image {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .ticket-image img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              object-position: center;
            }
            .ticket-number-right {
              position: absolute;
              top: 10px;
              right: 10px;
              color: #ff0000;
              font-size: 18pt;
              font-weight: bold;
              background: rgba(255, 255, 255, 0.9);
              padding: 4px 8px;
              border: 2px solid #ff0000;
              border-radius: 4px;
              z-index: 10;
            }
            .page-number {
              position: absolute;
              bottom: 5mm;
              right: 5mm;
              font-size: 8pt;
              color: #666;
              background: white;
              padding: 2px 5px;
              border-radius: 2px;
            }
            .loading-indicator {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba(255, 255, 255, 0.9);
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.2);
              z-index: 9999;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .no-print {
                display: none;
              }
              .page {
                page-break-after: always;
              }
              .ticket-container {
                page-break-inside: avoid;
                break-inside: avoid;
              }
            }
            .progress-bar {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba(255, 255, 255, 0.95);
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 20px rgba(0,0,0,0.3);
              z-index: 10000;
              text-align: center;
              min-width: 300px;
            }
            .progress-fill {
              width: 100%;
              height: 20px;
              background: #f0f0f0;
              border-radius: 10px;
              overflow: hidden;
              margin: 10px 0;
            }
            .progress-fill-bar {
              height: 100%;
              background: linear-gradient(90deg, #4CAF50, #45a049);
              transition: width 0.3s ease;
            }
          </style>
        </head>
        <body>
          <div id="content"></div>
          <div id="progress-indicator" class="progress-bar no-print">
            <h3>Generando boletos...</h3>
            <div class="progress-fill">
              <div id="progress-bar" class="progress-fill-bar" style="width: 0%"></div>
            </div>
            <p id="progress-text">Preparando...</p>
          </div>
          <button onclick="window.print()" class="no-print" style="
            position: fixed;
            bottom: 20px;
            left: 20px;
            padding: 10px 20px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          ">
            Imprimir Boletos
          </button>
        </body>
      </html>
    `);

    // Función para generar boletos por lotes
    const generarLote = (inicio: number, fin: number) => {
      const numerosOrdenados = generarSecuenciaAlterna(inicio, fin);
      let html = '';
      
      numerosOrdenados.forEach((numeros, pageIndex) => {
        html += `
          <div class="page">
            ${numeros.map(numero => `
              <div class="ticket-container">
                <div class="stub">
                  <div class="ticket-number">
                    No. ${numero.toString().padStart(4, '0')}
                  </div>
                  <div class="field">
                    <div class="field-label">Nombre:</div>
                    <div class="field-value"></div>
                  </div>
                  <div class="field">
                    <div class="field-label">Dirección:</div>
                    <div class="field-value"></div>
                  </div>
                  <div class="field">
                    <div class="field-label">Teléfono:</div>
                    <div class="field-value"></div>
                  </div>
                  <div class="field">
                    <div class="field-label">Ciudad:</div>
                    <div class="field-value"></div>
                  </div>
                </div>
                <div class="ticket">
                  ${imagenDerecha.value ? `
                    <div class="ticket-image">
                      <img src="${imagenDerecha.value}" alt="Diseño">
                    </div>
                  ` : ''}
                  <div class="ticket-number-right">
                    No. ${numero.toString().padStart(4, '0')}
                  </div>
                </div>
              </div>
            `).join('')}
            <div class="page-number">Página ${pageIndex + 1} de ${numerosOrdenados.length}</div>
          </div>
        `;
      });

      return html;
    };

    // Generar boletos en lotes
    const generarTodosLosLotes = async (ventanaImpresion) => {
      const contentDiv = ventanaImpresion.document.getElementById('content');
      const progressIndicator = ventanaImpresion.document.getElementById('progress-indicator');
      const progressBar = ventanaImpresion.document.getElementById('progress-bar');
      const progressText = ventanaImpresion.document.getElementById('progress-text');
      
      if (!contentDiv) return;

      let inicio = numerosInicio.value;
      const totalBoletos = numerosFin.value - numerosInicio.value + 1;
      let boletosGenerados = 0;
      
      while (inicio <= numerosFin.value) {
        const finLote = Math.min(inicio + maxBoletosPerBatch - 1, numerosFin.value);
        const boletosEnLote = finLote - inicio + 1;
        
        // Actualizar progreso
        const progreso = Math.round((boletosGenerados / totalBoletos) * 100);
        if (progressBar) progressBar.style.width = `${progreso}%`;
        if (progressText) progressText.textContent = `Generando boletos ${boletosGenerados + 1} - ${boletosGenerados + boletosEnLote} de ${totalBoletos}`;
        
        // Generar lote
        const html = generarLote(inicio, finLote);
        contentDiv.insertAdjacentHTML('beforeend', html);
        
        boletosGenerados += boletosEnLote;
        
        // Esperar un momento para permitir que el navegador procese el lote y no se congele
        await new Promise(resolve => setTimeout(resolve, batchDelay));
        
        // Forzar repaint del navegador
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        inicio = finLote + 1;
      }

      // Actualizar progreso final
      if (progressBar) progressBar.style.width = '100%';
      if (progressText) progressText.textContent = `¡Completado! ${totalBoletos} boletos generados`;
      
      // Ocultar el indicador de progreso después de un momento
      setTimeout(() => {
        if (progressIndicator) {
          progressIndicator.style.display = 'none';
        }
      }, 2000);
    };

    // Función para limpiar memoria durante la generación
    const limpiarMemoria = () => {
      if (window.gc) {
        window.gc();
      }
    };

    // Iniciar la generación de boletos
    generarTodosLosLotes(ventanaImpresion).catch(error => {
      console.error('Error generando boletos:', error);
      const progressIndicator = ventanaImpresion.document.getElementById('progress-indicator');
      if (progressIndicator) {
        progressIndicator.innerHTML = `
          <h3 style="color: red;">Error al generar boletos</h3>
          <p>Por favor, intente con menos boletos o recargue la página.</p>
          <button onclick="window.close()" style="padding: 10px 20px; margin-top: 10px;">Cerrar</button>
        `;
      }
    });
  }
};
</script>

<template>
  <div class="glass-section">
    <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
      Generador de Boletos
    </h2>

    <div class="glass rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">Configuración de Boletos</h3>

      <!-- Rango de Números -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Número Inicial
          </label>
          <input 
            v-model="numerosInicio"
            type="number"
            min="1"
            class="glass-input w-full"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Número Final
          </label>
          <input 
            v-model="numerosFin"
            type="number"
            :min="numerosInicio"
            class="glass-input w-full"
          >
        </div>
      </div>

      <!-- Subir Imagen -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Imagen para el Boleto (6.7" × 2")
        </label>
        <input 
          type="file" 
          accept="image/*"
          @change="handleImagenChange"
          class="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-xl file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                transition-all duration-200"
        >
      </div>

      <!-- Vista Previa -->
      <div class="mb-6 p-4 border rounded-lg">
        <h4 class="font-medium text-lg mb-4">Vista Previa del Boleto</h4>
        <div class="border border-black rounded max-w-4xl mx-auto flex">
          <!-- Talonario -->
          <div class="w-1/3 p-4 border-r border-dashed relative">
            <div class="text-red-600 font-bold text-sm mb-2">No. 0001</div>
            <div class="space-y-2">
              <div>
                <div class="text-xs text-gray-600">Nombre:</div>
                <div class="border-b border-gray-300 h-6"></div>
              </div>
              <div>
                <div class="text-xs text-gray-600">Dirección:</div>
                <div class="border-b border-gray-300 h-6"></div>
              </div>
              <div>
                <div class="text-xs text-gray-600">Teléfono:</div>
                <div class="border-b border-gray-300 h-6"></div>
              </div>
              <div>
                <div class="text-xs text-gray-600">Ciudad:</div>
                <div class="border-b border-gray-300 h-6"></div>
              </div>
            </div>
          </div>
          <!-- Diseño Principal -->
          <div class="w-2/3 relative overflow-hidden">
            <div class="flex items-center justify-center h-full">
              <img v-if="imagenDerecha" :src="imagenDerecha" alt="Diseño" class="w-full h-full object-contain">
            </div>
            <div class="absolute top-2 right-2 text-red-600 font-bold text-lg bg-white/90 px-2 py-1 rounded border-2 border-red-600">
              No. 0001
            </div>
          </div>
        </div>
      </div>

      <!-- Botón de Impresión -->
      <button 
        @click="imprimirBoletos"
        class="glass-button-success w-full"
      >
        Generar e Imprimir Boletos
      </button>
    </div>
  </div>
</template>