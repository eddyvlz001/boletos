import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { networkInterfaces } from 'os';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

// Configurar base de datos
const dbPath = join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '..', 'dist')));

// Obtener IPs disponibles
const getNetworkAddresses = () => {
  const interfaces = networkInterfaces();
  const addresses = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const interface_ of interfaces[name]) {
      // Omitir direcciones IPv6 y localhost
      if (interface_.family === 'IPv4' && !interface_.internal) {
        addresses.push(interface_.address);
      }
    }
  }
  
  return addresses;
};

// Ruta para obtener información del servidor
app.get('/api/server-info', (req, res) => {
  res.json({
    port,
    addresses: getNetworkAddresses()
  });
});

// Rutas API existentes...

// Servir la aplicación Vue
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

// Iniciar servidor
app.listen(port, host, () => {
  console.log(`Servidor ejecutándose en http://${host}:${port}`);
  console.log('Direcciones IP disponibles:');
  getNetworkAddresses().forEach(ip => {
    console.log(`  http://${ip}:${port}`);
  });
});