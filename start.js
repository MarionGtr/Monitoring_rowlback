import { spawn } from 'child_process';
import { createInterface } from 'readline';

// Lancer le serveur Express (backend)
const backend = spawn('node', ['server.js']);
console.log('Démarrage du serveur de tests sur http://localhost:3001');

// Lancer l'application Vite (frontend)
const frontend = spawn('npm', ['run', 'dev']);
console.log('Démarrage de l\'application Vite...');

// Gestion des logs pour le backend
backend.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data.toString().trim()}`);
});

// Gestion des logs pour le frontend
frontend.stdout.on('data', (data) => {
  console.log(`[Frontend] ${data.toString().trim()}`);
});

frontend.stderr.on('data', (data) => {
  console.error(`[Frontend Error] ${data.toString().trim()}`);
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
