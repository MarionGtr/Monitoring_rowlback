import { spawn, exec } from 'child_process';
import { config } from 'dotenv';
import { createInterface } from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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

// Fichier temporaire pour stocker les PIDs
const PIDS_FILE = path.join(__dirname, '.server-pids');

// Afficher les informations de configuration
console.log('\x1b[32m=== Configuration de la liaison avec un projet Nightwatch externe ===\x1b[0m');
console.log(`Projet Nightwatch externe: \x1b[33m${process.env.NIGHTWATCH_PROJECT_PATH}\x1b[0m`);

// Variables pour stocker les PIDs des processus
let backendPID;
let frontendPID;
let vitePID;

// Fonction pour tuer un processus de façon brutale
const killProcess = (pid, signal = 'SIGKILL') => {
  try {
    if (process.platform === 'win32') {
      exec(`taskkill /F /PID ${pid}`);
    } else {
      exec(`kill -${signal === 'SIGKILL' ? '9' : '15'} ${pid}`);
    }
    console.log(`Processus ${pid} arrêté avec ${signal}`);
    return true;
  } catch (e) {
    console.error(`Erreur lors de l'arrêt du processus ${pid}:`, e);
    return false;
  }
};

// Fonction pour tuer tous les processus sur un port spécifique
const killProcessOnPort = (port) => {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
        if (!err && stdout) {
          const matches = stdout.split('\n');
          matches.forEach(line => {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && /^\d+$/.test(pid)) {
              killProcess(pid);
            }
          });
        }
        resolve();
      });
    } else {
      exec(`lsof -t -i:${port}`, (err, stdout) => {
        if (!err && stdout) {
          const pids = stdout.trim().split('\n');
          pids.forEach(pid => {
            if (pid && /^\d+$/.test(pid)) {
              killProcess(pid);
            }
          });
        }
        resolve();
      });
    }
  });
};

// Nettoyage des éventuels processus laissés par une exécution précédente
const cleanupOldProcesses = async () => {
  try {
    if (fs.existsSync(PIDS_FILE)) {
      const content = fs.readFileSync(PIDS_FILE, 'utf8');
      const pids = content.split(',').filter(p => p.trim());

      console.log('Nettoyage des processus laissés par une exécution précédente...');
      pids.forEach(pid => {
        if (pid && /^\d+$/.test(pid)) {
          killProcess(pid);
        }
      });

      fs.unlinkSync(PIDS_FILE);
    }

    // Nettoyage additionnel des ports
    await killProcessOnPort(3001);
    await killProcessOnPort(5173);
  } catch (e) {
    console.error('Erreur lors du nettoyage des anciens processus:', e);
  }
};

// Fonction améliorée pour arrêter tous les processus
const cleanup = async () => {
  console.log('\n\x1b[33mArrêt des serveurs...\x1b[0m');

  // Arrêter les processus principaux
  if (backendPID) killProcess(backendPID);
  if (frontendPID) killProcess(frontendPID);
  if (vitePID) killProcess(vitePID);

  // Enregistrer les PIDs dans un fichier pour le nettoyage futur si nécessaire
  const pids = [backendPID, frontendPID, vitePID].filter(Boolean).join(',');
  fs.writeFileSync(PIDS_FILE, pids);

  // Arrêter tous les processus sur les ports pertinents
  await killProcessOnPort(3001);
  await killProcessOnPort(5173);

  console.log('\x1b[32mServeurs arrêtés.\x1b[0m');
  process.exit(0);
};

// Nettoyage initial
await cleanupOldProcesses();

// Lancer le serveur Express (backend)
const backend = spawn('node', ['server.js']);
backendPID = backend.pid;
console.log(`Démarrage du serveur de tests sur http://localhost:3001 (PID: ${backendPID})`);

// Lancer l'application Vite (frontend)
const frontend = spawn('npm', ['run', 'dev']);
frontendPID = frontend.pid;
console.log(`Démarrage de l'application Vite... (PID: ${frontendPID})`);

// Gestion des logs pour le backend
backend.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log(`\x1b[36m[Backend]\x1b[0m ${output}`);
});

backend.stderr.on('data', (data) => {
  const output = data.toString().trim();
  console.error(`\x1b[31m[Backend Error]\x1b[0m ${output}`);
});

// Gestion des logs pour le frontend
frontend.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log(`\x1b[35m[Frontend]\x1b[0m ${output}`);

  // Capturer le PID du serveur Vite si disponible
  const match = output.match(/running at http:\/\/localhost:(\d+)/);
  if (match) {
    const port = match[1];
    console.log(`\x1b[32mServeur Vite détecté sur le port ${port}\x1b[0m`);

    // Essayer d'identifier le PID du processus Vite
    if (process.platform === 'win32') {
      exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
        if (!err && stdout) {
          const parts = stdout.trim().split(/\s+/);
          vitePID = parts[parts.length - 1];
          console.log(`PID du serveur Vite: ${vitePID}`);
        }
      });
    } else {
      exec(`lsof -t -i:${port}`, (err, stdout) => {
        if (!err && stdout) {
          vitePID = stdout.trim();
          console.log(`PID du serveur Vite: ${vitePID}`);
        }
      });
    }
  }
});

frontend.stderr.on('data', (data) => {
  const output = data.toString().trim();
  console.error(`\x1b[31m[Frontend Error]\x1b[0m ${output}`);
});

// Gestion des signaux de terminaison
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Écouter les commandes de l'utilisateur
const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.on('line', (input) => {
  if (input.toLowerCase() === 'quit' || input.toLowerCase() === 'exit') {
    cleanup();
  } else if (input.toLowerCase() === 'status') {
    console.log('\n\x1b[32m=== État des serveurs ===\x1b[0m');
    console.log(`Backend (PID: ${backendPID}): ${backend.killed ? 'Arrêté' : 'En cours d\'exécution'}`);
    console.log(`Frontend (PID: ${frontendPID}): ${frontend.killed ? 'Arrêté' : 'En cours d\'exécution'}`);
    if (vitePID) console.log(`Vite (PID: ${vitePID}): En cours d'exécution`);

    console.log('Serveurs en cours d\'exécution:');
    if (process.platform === 'win32') {
      exec('netstat -ano | findstr :3001', (err, stdout) => {
        console.log('Port 3001:', stdout || 'Aucun processus');
      });
      exec('netstat -ano | findstr :5173', (err, stdout) => {
        console.log('Port 5173:', stdout || 'Aucun processus');
      });
    } else {
      exec('lsof -i:3001', (err, stdout) => {
        console.log('Port 3001:', stdout || 'Aucun processus');
      });
      exec('lsof -i:5173', (err, stdout) => {
        console.log('Port 5173:', stdout || 'Aucun processus');
      });
    }
  } else if (input.toLowerCase() === 'kill') {
    console.log('\n\x1b[31mForce l\'arrêt des serveurs avec SIGKILL\x1b[0m');
    killProcessOnPort(3001);
    killProcessOnPort(5173);
  }
});

console.log('\x1b[32mLes deux serveurs sont maintenant en cours d\'exécution\x1b[0m');
console.log('Tapez "exit" ou "quit" pour arrêter les serveurs');
console.log('Tapez "status" pour voir l\'état des serveurs');
console.log('Tapez "kill" pour forcer l\'arrêt brutal des serveurs');
