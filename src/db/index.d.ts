import sqlite3 from 'sqlite3';
declare const db: sqlite3.Database;
export declare const initDatabase: () => Promise<unknown>;
export default db;
