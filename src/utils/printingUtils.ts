/**
 * Printing Utilities Library
 * Provides functions for consistent document printing with proper page layout control
 */

/**
 * Options for document printing
 */
export interface PrintOptions {
  title: string;
  showPageNumbers?: boolean;
  pageSize?: 'letter' | 'a4' | 'legal';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

/**
 * Creates a print window with proper page layout control
 */
export function createPrintWindow(options: PrintOptions = { title: 'Print Document' }) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Failed to open print window. Please check your popup blocker settings.');
    return null;
  }

  // Set default options
  const pageSize = options.pageSize || 'letter';
  const orientation = options.orientation || 'portrait';
  const margins = options.margins || { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' };
  const showPageNumbers = options.showPageNumbers !== undefined ? options.showPageNumbers : true;

  // Write the document head
  printWindow.document.write(`
    <html>
      <head>
        <title>${options.title}</title>
        <style>
          @page {
            size: ${pageSize} ${orientation};
            margin: ${margins.top || '0.5in'} ${margins.right || '0.5in'} ${margins.bottom || '0.5in'} ${margins.left || '0.5in'};
          }
          body { 
            font-family: Arial, sans-serif;
            line-height: 1.3;
            margin: 0;
            padding: 0;
            color: #333;
            font-size: 10pt;
          }
          .container {
            max-width: 100%;
            margin: 0 auto;
          }
          .page {
            position: relative;
            box-sizing: border-box;
            width: 100%;
          }
          .page-content {
            width: 100%;
          }
          .section {
            margin-bottom: 15px;
          }
          .section-title {
            color: #2563eb;
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 3px;
            border-bottom: 1px solid #2563eb;
          }
          .page-break {
            page-break-after: always;
          }
          .no-break {
            page-break-inside: avoid;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            gap: 40px;
            margin-top: 40px;
          }
          .signature {
            flex: 1;
            text-align: center;
          }
          .signature-line {
            border-top: 1px solid #000;
            margin-top: 40px;
            padding-top: 5px;
            font-size: 9pt;
          }
          .page-number {
            position: absolute;
            bottom: 10px;
            right: 10px;
            font-size: 8pt;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          table th, table td {
            border: 1px solid #e5e7eb;
            padding: 5px;
            text-align: left;
            font-size: 9pt;
          }
          table th {
            background: #f8fafc;
            font-weight: 600;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div id="print-content"></div>
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
          Imprimir
        </button>
      </body>
    </html>
  `);

  return printWindow;
}

/**
 * Adds a page to the print document
 */
export function addPage(printWindow: Window, content: string, isLastPage: boolean = false) {
  const pageClass = isLastPage ? 'page' : 'page page-break';
  const pageContent = `
    <div class="${pageClass}">
      <div class="page-content">
        ${content}
      </div>
    </div>
  `;
  
  const contentDiv = printWindow.document.getElementById('print-content');
  if (contentDiv) {
    contentDiv.insertAdjacentHTML('beforeend', pageContent);
  }
}

/**
 * Creates a table with items that won't break across pages
 */
export function createItemsTable(items: any[], columns: {key: string, label: string}[], className: string = '') {
  if (!items || items.length === 0) return '';
  
  return `
    <div class="no-break ${className}">
      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              ${columns.map(col => `<td>${getNestedProperty(item, col.key)}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Helper function to get nested property from an object using dot notation
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : null;
  }, obj) || '';
}

/**
 * Formats currency values
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(value);
}

/**
 * Formats dates
 */
export function formatDate(date: Date | string): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}