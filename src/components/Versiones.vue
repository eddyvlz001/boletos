<template>
  <div class="glass-section">
    <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
      Versiones del Sistema
    </h2>

    <!-- Descargar Aplicación -->
    <div class="glass rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">Descargar Aplicación</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Versión Windows -->
        <div class="glass p-6 rounded-lg">
          <h4 class="text-lg font-semibold mb-2">Versión para Windows</h4>
          <div class="flex items-center justify-between mb-4">
            <span class="text-2xl font-bold text-blue-600">v1.0.0</span>
            <span class="px-2 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">Estable</span>
          </div>
          <p class="text-gray-600 mb-4">Aplicación nativa para Windows con base de datos local.</p>
          <div class="space-y-2">
            <a 
              href="/release/SistemaContratos-Setup-1.0.0.exe" 
              download
              class="glass-button-primary w-full text-center block"
            >
              Descargar Instalador
            </a>
            <a 
              href="/release/SistemaContratos-Portable-1.0.0.exe" 
              download
              class="glass-button w-full text-center block"
            >
              Descargar Portable
            </a>
          </div>
        </div>

        <!-- Versión Mac -->
        <div class="glass p-6 rounded-lg">
          <h4 class="text-lg font-semibold mb-2">Versión para Mac</h4>
          <div class="flex items-center justify-between mb-4">
            <span class="text-2xl font-bold text-blue-600">v1.0.0</span>
            <span class="px-2 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">Estable</span>
          </div>
          <p class="text-gray-600 mb-4">Aplicación nativa para macOS con base de datos local.</p>
          <div class="space-y-2">
            <a 
              href="/release/SistemaContratos-1.0.0.dmg" 
              download
              class="glass-button-primary w-full text-center block"
            >
              Descargar DMG
            </a>
            <a 
              href="/release/SistemaContratos-1.0.0-mac.zip" 
              download
              class="glass-button w-full text-center block"
            >
              Descargar ZIP
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuración de Red -->
    <div class="glass rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">Configuración de Red</h3>
      <p class="text-gray-600 mb-4">
        Al iniciar la aplicación por primera vez, se mostrará una pantalla de configuración donde podrás establecer:
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Configuración del Servidor -->
        <div class="glass p-4 rounded-lg">
          <h4 class="font-medium text-lg mb-2">Dirección IP del Servidor</h4>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Usa <code class="bg-gray-100 px-2 py-1 rounded">0.0.0.0</code> para permitir conexiones desde cualquier IP</li>
            <li>Usa <code class="bg-gray-100 px-2 py-1 rounded">127.0.0.1</code> para uso local únicamente</li>
            <li>Usa una IP específica de tu red para acceso limitado</li>
          </ul>
        </div>

        <!-- Configuración del Puerto -->
        <div class="glass p-4 rounded-lg">
          <h4 class="font-medium text-lg mb-2">Puerto</h4>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Por defecto: <code class="bg-gray-100 px-2 py-1 rounded">3000</code></li>
            <li>Puedes cambiarlo si el puerto está en uso</li>
            <li>Asegúrate que el puerto esté abierto en el firewall</li>
          </ul>
        </div>
      </div>

      <div class="mt-4 bg-blue-50 p-4 rounded-lg">
        <h4 class="font-medium text-lg mb-2 text-blue-800">Acceso en Red</h4>
        <p class="text-blue-700">
          Una vez configurado, otros equipos en la red podrán acceder usando:
          <code class="bg-white px-2 py-1 rounded">http://IP-DEL-SERVIDOR:PUERTO</code>
        </p>
        <p class="text-blue-700 mt-2">
          Ejemplo: <code class="bg-white px-2 py-1 rounded">http://192.168.1.100:3000</code>
        </p>
      </div>
    </div>

    <!-- Requisitos del Sistema -->
    <div class="glass rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">Requisitos del Sistema</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Requisitos Windows -->
        <div>
          <h4 class="font-medium text-lg mb-2">Windows</h4>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Windows 10 o superior (64 bits)</li>
            <li>4GB de RAM mínimo</li>
            <li>500MB de espacio en disco</li>
            <li>Procesador Intel/AMD x64</li>
            <li>Conexión a red (para uso en red)</li>
          </ul>
        </div>

        <!-- Requisitos Mac -->
        <div>
          <h4 class="font-medium text-lg mb-2">macOS</h4>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>macOS 10.15 o superior</li>
            <li>4GB de RAM mínimo</li>
            <li>500MB de espacio en disco</li>
            <li>Procesador Intel o Apple Silicon</li>
            <li>Conexión a red (para uso en red)</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Notas de la Versión -->
    <div class="glass rounded-xl p-6">
      <h3 class="text-xl font-semibold mb-4">Notas de la Versión 1.0.0</h3>

      <div class="space-y-6">
        <div>
          <h4 class="font-medium text-lg mb-2">Características Principales</h4>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Sistema completo de gestión de contratos</li>
            <li>Módulo de órdenes de trabajo</li>
            <li>Sistema de rifas con generación de boletos</li>
            <li>Gestión de clientes y servicios</li>
            <li>Impresión de documentos</li>
            <li>Base de datos local SQLite</li>
            <li>Soporte para trabajo en red</li>
            <li>Interfaz moderna y responsiva</li>
          </ul>
        </div>

        <div>
          <h4 class="font-medium text-lg mb-2">Instalación</h4>
          <div class="space-y-4">
            <div class="glass p-4 rounded-lg">
              <h5 class="font-medium mb-2">Windows Instalador</h5>
              <ol class="list-decimal list-inside space-y-2 text-gray-700">
                <li>Ejecuta el archivo .exe como administrador</li>
                <li>Sigue el asistente de instalación</li>
                <li>Elige la ubicación de instalación</li>
                <li>Espera a que termine la instalación</li>
                <li>Inicia la aplicación desde el acceso directo</li>
              </ol>
            </div>

            <div class="glass p-4 rounded-lg">
              <h5 class="font-medium mb-2">Windows Portable</h5>
              <ol class="list-decimal list-inside space-y-2 text-gray-700">
                <li>Extrae el archivo en la ubicación deseada</li>
                <li>Ejecuta SistemaContratos.exe</li>
                <li>Configura la red en el primer inicio</li>
              </ol>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-medium text-lg mb-2 text-blue-800">Soporte</h4>
          <p class="text-blue-700">
            Para soporte técnico o reportar problemas, contacta a nuestro equipo:
          </p>
          <ul class="list-disc list-inside mt-2 text-blue-700">
            <li>Email: soporte@sistemacontratos.com</li>
            <li>Teléfono: (123) 456-7890</li>
            <li>Horario: Lunes a Viernes, 9:00 AM - 6:00 PM</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>