import fs from 'fs-extra';
import archiver from 'archiver';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

async function buildPlugin() {
  // Clean and create plugin directory
  const pluginDir = join(rootDir, 'dist-plugin');
  await fs.emptyDir(pluginDir);
  
  // Copy plugin files
  await fs.copy(join(rootDir, 'sistema-contratos'), pluginDir);
  
  // Create zip file
  const output = fs.createWriteStream(join(rootDir, 'sistema-contratos.zip'));
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  output.on('close', () => {
    console.log('Plugin package created successfully');
  });
  
  archive.on('error', (err) => {
    throw err;
  });
  
  archive.pipe(output);
  archive.directory(pluginDir, 'sistema-contratos');
  await archive.finalize();
}

buildPlugin().catch(console.error);