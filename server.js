import express from "express";
import cors from "cors";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Configuration des chemins vers le projet Nightwatch externe
// Chemin pour TROUVER les tests
const EXTERNAL_TESTS_PATH = process.env.NIGHTWATCH_PROJECT_PATH || "/Users/juliennicolle/ForEachAcademy/ProjetsRowlback/nightwatchjs/nightwatch ";
// Chemin pour EXÉCUTER les tests (un niveau plus haut)
const EXTERNAL_EXECUTION_PATH = path.dirname(EXTERNAL_TESTS_PATH);

// Vérifier si les chemins sont valides
try {
  fs.accessSync(EXTERNAL_TESTS_PATH, fs.constants.R_OK);
  console.log(`Dossier de tests trouvé: ${EXTERNAL_TESTS_PATH}`);

  fs.accessSync(EXTERNAL_EXECUTION_PATH, fs.constants.R_OK);
  console.log(`Dossier d'exécution trouvé: ${EXTERNAL_EXECUTION_PATH}`);
} catch (err) {
  console.error(`ATTENTION: Un des chemins n'est pas accessible: ${err.message}`);
  console.error("Veuillez définir la variable d'environnement NIGHTWATCH_PROJECT_PATH correctement");
}

// Activer CORS pour toutes les requêtes
app.use(cors());
// Parser pour les requêtes JSON
app.use(express.json());

// Route pour lancer un test spécifique du projet externe
app.get("/run-test/:testName(*)", (req, res) => {
  const testName = req.params.testName;
  console.log(`Lancement du test Nightwatch externe: ${testName}`);

  // Vérifier si le fichier de test existe
  const testPath = path.join(EXTERNAL_TESTS_PATH, "tests", `${testName}.js`);
  console.log(`Chemin du test: ${testPath}`);

  if (!fs.existsSync(testPath)) {
    console.error(`Le fichier de test n'existe pas: ${testPath}`);
    return res.status(404).json({
      success: false,
      error: `Test non trouvé: ${testName}`
    });
  }

  // Chemin relatif du test par rapport au dossier d'exécution
  const relativePath = path.relative(EXTERNAL_EXECUTION_PATH, testPath);
  console.log(`Chemin relatif du test: ${relativePath}`);

  // Exécuter le test depuis le dossier d'exécution
  const command = `cd "${EXTERNAL_EXECUTION_PATH}" && npx nightwatch "${relativePath}"`;
  console.log(`Commande exécutée: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur d'exécution: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: error.message,
        output: stderr || stdout
      });
    }

    console.log(`Résultat des tests:\n${stdout}`);
    return res.json({
      success: true,
      output: stdout
    });
  });
});

// Route pour obtenir la liste des tests disponibles dans le projet externe
app.get("/tests", (req, res) => {
  const testDir = path.join(EXTERNAL_TESTS_PATH, "tests");

  console.log(`Recherche des tests dans: ${testDir}`);

  // Vérifier si le dossier de tests existe
  try {
    fs.accessSync(testDir, fs.constants.R_OK);
    console.log(`Le dossier des tests est accessible`);

    // Lister les fichiers directement avec fs au lieu de find
    const files = fs.readdirSync(testDir, { withFileTypes: true });
    console.log(`Fichiers trouvés: ${files.length}`);

    const tests = [];

    // Traiter chaque fichier
    files.forEach(file => {
      if (file.isFile() && file.name.endsWith('.js')) {
        console.log(`Fichier de test trouvé: ${file.name}`);
        const fileName = path.basename(file.name, '.js');
        tests.push({
          id: fileName,
          name: fileName,
          path: file.name
        });
      } else if (file.isDirectory()) {
        console.log(`Dossier trouvé: ${file.name}`);
      } else {
        console.log(`Ignoré (non .js ou non fichier): ${file.name}`);
      }
    });

    // Rechercher également dans les sous-dossiers
    const scanDirectory = (dir, baseDir) => {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      items.forEach(item => {
        const itemPath = path.join(dir, item.name);

        if (item.isDirectory()) {
          scanDirectory(itemPath, baseDir);
        } else if (item.isFile() && item.name.endsWith('.js')) {
          const relativePath = path.relative(baseDir, itemPath);
          const relativePathWithoutExt = relativePath.replace(/\.js$/, '');
          console.log(`Test dans sous-dossier trouvé: ${relativePath}`);

          tests.push({
            id: relativePathWithoutExt,
            name: path.basename(item.name, '.js'),
            path: relativePath
          });
        }
      });
    };

    // Parcourir les sous-dossiers
    files.forEach(file => {
      if (file.isDirectory()) {
        const dirPath = path.join(testDir, file.name);
        console.log(`Parcours du sous-dossier: ${dirPath}`);
        scanDirectory(dirPath, testDir);
      }
    });

    console.log(`Total des tests trouvés: ${tests.length}`);

    if (tests.length === 0) {
      console.log("ATTENTION: Aucun test trouvé!");
      // Lister tous les fichiers du répertoire pour le débogage
      exec(`find "${testDir}" -type f | sort`, (error, stdout, stderr) => {
        console.log("Liste de tous les fichiers dans le répertoire:");
        console.log(stdout || "Aucun fichier trouvé");
      });
    }

    return res.json({
      success: true,
      tests: tests
    });
  } catch (err) {
    console.error(`Erreur d'accès au dossier de tests: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: `Le dossier de tests n'est pas accessible: ${testDir}. Erreur: ${err.message}`
    });
  }
});

// Route pour lancer tous les tests (compatibilité rétroactive)
app.get("/launch", (req, res) => {
  console.log("Lancement de tous les tests Nightwatch du projet externe...");

  // Exécuter depuis le dossier parent
  exec(`cd "${EXTERNAL_EXECUTION_PATH}" && npx nightwatch nightwatch/tests/`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur: ${stderr}`);
      res.status(500).send(`Erreur: ${stderr}`);
      return;
    }
    console.log(`Résultat des tests:\n${stdout}`);
    res.send(stdout);
  });
});

app.listen(PORT, () => {
  console.log(`Serveur de test en écoute sur http://localhost:${PORT}`);
});
