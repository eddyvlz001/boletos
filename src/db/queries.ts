import sqlite3 from 'sqlite3';
import type { Cliente, OrdenTrabajo } from '../types';

// Get database instance
const db = global.db as sqlite3.Database;

// Cliente queries
export const getClientes = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM clientes ORDER BY nombre', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const insertCliente = (cliente: Cliente) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO clientes (nombre, email, telefono, direccion, ciudad, codigo_postal)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      cliente.nombre,
      cliente.email,
      cliente.telefono,
      cliente.direccion,
      cliente.ciudad,
      cliente.codigoPostal,
      function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

// Add other query functions...