import { existsSync, unlinkSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
var __dirname = dirname(fileURLToPath(import.meta.url));
var dbPath = join(__dirname, '..', 'database.sqlite');
// Remove existing database if it exists
if (existsSync(dbPath)) {
    unlinkSync(dbPath);
}
// Import and execute database configuration
import('../src/db/schema.js');
console.log('Database migrated successfully');
