import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { randomBytes, pbkdf2Sync } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', '..', 'database.sqlite');

// Create database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Usuarios table
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    nombre TEXT,
    email TEXT UNIQUE,
    rol TEXT CHECK(rol IN ('admin', 'usuario')) DEFAULT 'usuario',
    activo BOOLEAN DEFAULT true,
    ultimo_acceso DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Sesiones table
  CREATE TABLE IF NOT EXISTS sesiones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    token TEXT UNIQUE NOT NULL,
    fecha_expiracion DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  -- Empresa table
  CREATE TABLE IF NOT EXISTS empresa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    direccion TEXT,
    telefono TEXT,
    email TEXT,
    logo TEXT,
    qr TEXT,
    numero_secuencial INTEGER DEFAULT 1
  );

  -- Resto de las tablas existentes...
`);

// Crear usuario admin por defecto si no existe
const createDefaultAdmin = () => {
  const username = 'admin';
  const password = 'admin123';
  const salt = randomBytes(16).toString('hex');
  const passwordHash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO usuarios (username, password_hash, salt, nombre, email, rol)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(username, passwordHash, salt, 'Administrador', 'admin@example.com', 'admin');
};

createDefaultAdmin();

console.log('Database schema created successfully');

export default db;