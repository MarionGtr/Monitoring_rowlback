# Monitoring_rowlback

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run End-to-End Tests with [Nightwatch](https://nightwatchjs.org/)

```sh
# When using CI, the project must be built first.
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chrome
npm run test:e2e -- --env chrome
# Runs the tests of a specific file
npm run test:e2e -- tests/e2e/example.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```
    
### Run Headed Component Tests with [Nightwatch Component Testing](https://nightwatchjs.org/guide/component-testing/introduction.html)
  
```sh
npm run test:unit
npm run test:unit -- --headless # for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

DEV DE MARION ET JULIEN

Dashboard de Tests Nightwatch - Vue d'ensemble technique
Objectif du projet
Nous avons créé un dashboard web qui permet de lancer et visualiser les résultats des tests Nightwatch depuis une interface utilisateur intuitive. Le système connecte une application frontend Vue.js avec un projet Nightwatch externe existant.
Architecture
Le système est composé de trois parties principales :

Frontend Vue.js - Interface utilisateur pour afficher et lancer les tests
Serveur Express - Backend qui fait le pont avec le projet Nightwatch
Projet Nightwatch externe - Contient les tests end-to-end existants (ici projet nightwatchjs sur le BitBucket Rowlback)

Flux de données

L'utilisateur interagit avec l'interface Vue.js
Le frontend envoie des requêtes au serveur Express
Le serveur Express communique avec le projet Nightwatch
Les résultats des tests sont renvoyés à l'interface utilisateur

Détails techniques
Serveur Express (server.js)
Le serveur Node.js expose plusieurs endpoints :

/tests - Liste tous les tests disponibles dans le projet Nightwatch
/run-test/:testName - Exécute un test spécifique
/launch - Lance tous les tests

Une particularité importante : le serveur utilise deux chemins distincts :

Les chemins sont a parametrer dans le server.js et dans le.env

Un chemin pour trouver les tests (/home/.../nightwatchjs/nightwatch/tests/)
Un chemin pour exécuter les tests (un niveau au-dessus, /home/.../nightwatchjs/)

Interface Vue.js
L'interface présente :

Une page globale avec la liste des clients
Des pages details par client avec la liste des test propre au client.
Des boutons pour lancer chaque test individuellement
L'affichage des résultats des tests
Des indicateurs visuels de statut (réussite, échec, etc.)

Script de démarrage (start-with-external.js)
Ce script démarre simultanément :

Le serveur Express backend
L'application Vue.js frontend

Il gère également la terminaison propre des deux serveurs quand l'utilisateur souhaite quitter.
Configuration initiale
La configuration initiale se fait via le fichier .env qui contient le chemin vers le projet Nightwatch externe. Le système détecte automatiquement les tests disponibles dans ce projet.
Personnalisation
Les descriptions des tests peuvent être personnalisées via un fichier JSON test-descriptions.json.

Utilisation pour le développeur

Installer les dépendances : npm install
Configurer le chemin du projet Nightwatch dans le fichier .env
Démarrer le système : npm run start:external
Accéder à l'interface via http://localhost:5173
Pour terminer, taper exit ou quit dans le terminal