import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import Store from 'electron-store';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const __dirname = dirname(fileURLToPath(import.meta.url));
const store = new Store();
let mainWindow;
let server;

// Configurar servidor Express
const setupServer = (port = 3000) => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.static(join(__dirname, '..', 'dist')));

  // Configurar base de datos
  const dbPath = join(app.getPath('userData'), 'database.sqlite');
  const db = new sqlite3.Database(dbPath);

  // Rutas API
  app.get('/api/server-info', (req, res) => {
    res.json({
      port,
      dbPath
    });
  });

  // Servir la aplicación Vue
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
  });

  return app;
};

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: join(__dirname, '..', 'build', 'icon.ico')
  });

  // Verificar si es la primera ejecución
  const isFirstRun = !store.get('serverConfig');
  
  if (isFirstRun) {
    mainWindow.loadFile(join(__dirname, 'setup.html'));
  } else {
    const serverConfig = store.get('serverConfig');
    const app = setupServer(serverConfig.port);
    server = app.listen(serverConfig.port, serverConfig.host, () => {
      mainWindow.loadURL(`http://localhost:${serverConfig.port}`);
    });
  }
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (server) {
      server.close();
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Manejar la configuración inicial
ipcMain.on('save-config', (event, config) => {
  store.set('serverConfig', config);
  const app = setupServer(config.port);
  server = app.listen(config.port, config.host, () => {
    mainWindow.loadURL(`http://localhost:${config.port}`);
  });
});

// Manejar errores de la aplicación
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Promesa rechazada no manejada:', error);
});