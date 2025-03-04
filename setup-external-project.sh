#!/bin/bash

# Script pour configurer la liaison avec un projet Nightwatch externe

# Couleurs pour l'affichage
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Configuration de la liaison avec un projet Nightwatch externe ===${NC}\n"

# Demander le chemin vers le projet Nightwatch externe
echo -e "Veuillez entrer le chemin ${YELLOW}absolu${NC} vers votre projet Nightwatch externe:"
echo -e "(Ce doit être le répertoire qui contient le dossier 'tests' avec vos tests Nightwatch)"
read external_project_path

# Vérifier si le chemin existe
if [ ! -d "$external_project_path" ]; then
  echo -e "${RED}Le chemin '$external_project_path' n'existe pas.${NC}"
  exit 1
fi

# Vérifier si le dossier tests existe dans le projet
if [ ! -d "$external_project_path/tests" ]; then
  echo -e "${YELLOW}ATTENTION: Le dossier 'tests' n'a pas été trouvé dans '$external_project_path'.${NC}"
  echo -e "Est-ce que vos tests Nightwatch sont dans un autre dossier? (y/n)"
  read answer
  
  if [[ $answer =~ ^[Yy]$ ]]; then
    echo "Veuillez entrer le nom du dossier contenant vos tests Nightwatch:"
    read tests_folder
    
    if [ ! -d "$external_project_path/$tests_folder" ]; then
      echo -e "${RED}Le dossier '$tests_folder' n'existe pas dans le projet.${NC}"
      exit 1
    fi
    
    echo -e "${YELLOW}ATTENTION: La configuration nécessitera des modifications manuelles supplémentaires.${NC}"
    echo -e "${YELLOW}Vous devrez modifier le fichier server.js pour utiliser le bon dossier de tests.${NC}"
  else
    echo -e "${RED}Impossible de continuer sans un dossier de tests valide.${NC}"
    exit 1
  fi
fi

# Créer ou mettre à jour un fichier .env
echo "NIGHTWATCH_PROJECT_PATH=\"$external_project_path\"" > .env
echo -e "${GREEN}Fichier .env créé avec NIGHTWATCH_PROJECT_PATH=\"$external_project_path\"${NC}"

# Mise à jour de package.json pour utiliser dotenv
if ! grep -q "dotenv" package.json; then
  echo -e "${YELLOW}Ajout de dotenv comme dépendance...${NC}"
  npm install --save dotenv
fi

# Créer un script de démarrage avec la variable d'environnement
cat > start-with-external.js << EOL
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
console.log(\`Projet Nightwatch externe: \x1b[33m\${process.env.NIGHTWATCH_PROJECT_PATH}\x1b[0m\`);

// Lancer le serveur Express (backend)
const backend = spawn('node', ['server.js']);
console.log('Démarrage du serveur de tests sur http://localhost:3001');

// Lancer l'application Vite (frontend)
const frontend = spawn('npm', ['run', 'dev']);
console.log('Démarrage de l\'application Vite...');

// Gestion des logs pour le backend
backend.stdout.on('data', (data) => {
  console.log(\`\x1b[36m[Backend]\x1b[0m \${data.toString().trim()}\`);
});

backend.stderr.on('data', (data) => {
  console.error(\`\x1b[31m[Backend Error]\x1b[0m \${data.toString().trim()}\`);
});

// Gestion des logs pour le frontend
frontend.stdout.on('data', (data) => {
  console.log(\`\x1b[35m[Frontend]\x1b[0m \${data.toString().trim()}\`);
});

frontend.stderr.on('data', (data) => {
  console.error(\`\x1b[31m[Frontend Error]\x1b[0m \${data.toString().trim()}\`);
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
EOL

echo -e "${GREEN}Script de démarrage start-with-external.js créé${NC}"

# Ajouter le script au package.json s'il n'existe pas déjà
if ! grep -q "\"start:external\"" package.json; then
  # Utilisation de sed pour ajouter le nouveau script dans la section "scripts"
  sed -i '/"scripts": {/a \    "start:external": "node start-with-external.js",' package.json
  echo -e "${GREEN}Script 'start:external' ajouté à package.json${NC}"
fi

echo -e "\n${GREEN}Configuration terminée !${NC}"
echo -e "Pour démarrer l'application avec le projet externe, exécutez:"
echo -e "${YELLOW}npm run start:external${NC}"
echo -e "Si vous devez modifier le chemin du projet externe, modifiez le fichier .env"