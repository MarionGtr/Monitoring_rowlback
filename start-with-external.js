import { spawn } from 'child_process';
import { config } from 'dotenv';
import { createInterface } from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement depuis .env
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vérifier que la variable d'environnement est définie
if (!process.env.NIGHTWATCH_PROJECT_PATH) {
  console.error('\x1b[31mErreur: NIGHTWATCH_PROJECT_PATH n\'est pas défini dans le fichier .env\x1b[0m');
  console.error('Exécutez d\'abord le script setup-external-project.sh');
  process.exit(1);
}

// Afficher les informations de configuration
console.log('\x1b[32m=== Configuration de la liaison avec un projet Nightwatch externe ===\x1b[0m');
console.log(`Projet Nightwatch externe: \x1b[33m${process.env.NIGHTWATCH_PROJECT_PATH}\x1b[0m`);

// Lancer le serveur Express (backend)
const backend = spawn('node', ['server.js']);
console.log('Démarrage du serveur de tests sur http://localhost:3001');

// Lancer l'application Vite (frontend)
const frontend = spawn('npm', ['run', 'dev']);
console.log('Démarrage de l\'application Vite...');

// Gestion des logs pour le backend
backend.stdout.on('data', (data) => {
  console.log(`\x1b[36m[Backend]\x1b[0m ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.error(`\x1b[31m[Backend Error]\x1b[0m ${data.toString().trim()}`);
});

// Gestion des logs pour le frontend
frontend.stdout.on('data', (data) => {
  console.log(`\x1b[35m[Frontend]\x1b[0m ${data.toString().trim()}`);
});

frontend.stderr.on('data', (data) => {
  console.error(`\x1b[31m[Frontend Error]\x1b[0m ${data.toString().trim()}`);
});

// Gestion de la fermeture des processus
const cleanup = () => {
  console.log('Arrêt des serveurs...');
  backend.kill();
  frontend.kill();
  process.exit(0);
};

// Écouter les commandes de l'utilisateur
const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.on('line', (input) => {
  if (input.toLowerCase() === 'quit' || input.toLowerCase() === 'exit') {
    cleanup();
  }
});

// Gestion des signaux de terminaison
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

console.log('Les deux serveurs sont maintenant en cours d\'exécution');
console.log('Tapez "exit" ou "quit" pour arrêter les serveurs');
