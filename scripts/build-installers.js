import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

async function buildInstallers() {
  try {
    // Clean release directory
    await fs.emptyDir(join(rootDir, 'release'));

    // Build Vue application
    console.log('Building Vue application...');
    await execAsync('npm run build');

    // Build Mac installer
    console.log('Building Mac installer...');
    await execAsync('npm run build:mac');

    // Build Windows installer
    console.log('Building Windows installer...');
    await execAsync('npm run build:win');

    // Build WordPress plugin
    console.log('Building WordPress plugin...');
    await execAsync('npm run build:plugin');

    console.log('All installers built successfully!');
    
    // List generated files
    const files = await fs.readdir(join(rootDir, 'release'));
    console.log('\nGenerated files:');
    files.forEach(file => console.log(`- ${file}`));
  } catch (error) {
    console.error('Error building installers:', error);
    process.exit(1);
  }
}

buildInstallers().catch(console.error);