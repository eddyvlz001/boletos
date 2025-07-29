import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
var __dirname = dirname(fileURLToPath(import.meta.url));
var dbPath = join(__dirname, '..', '..', 'database.sqlite');
// Create database connection
var db = new sqlite3.Database(dbPath);
// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');
// Initialize database
export var initDatabase = function () {
    return new Promise(function (resolve, reject) {
        db.serialize(function () {
            // Create tables
            db.run("\n        CREATE TABLE IF NOT EXISTS empresa (\n          id INTEGER PRIMARY KEY AUTOINCREMENT,\n          nombre TEXT,\n          direccion TEXT,\n          telefono TEXT,\n          email TEXT,\n          logo TEXT,\n          qr TEXT,\n          numero_secuencial INTEGER DEFAULT 1\n        )\n      ");
            db.run("\n        CREATE TABLE IF NOT EXISTS clientes (\n          id INTEGER PRIMARY KEY AUTOINCREMENT,\n          nombre TEXT NOT NULL,\n          email TEXT,\n          telefono TEXT,\n          direccion TEXT,\n          ciudad TEXT,\n          codigo_postal TEXT,\n          created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n        )\n      ");
            // Add other table creation statements...
            resolve();
        });
    });
};
export default db;
