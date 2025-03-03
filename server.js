import express from "express";
import cors from "cors";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Activer CORS pour toutes les requêtes
app.use(cors());
// Parser pour les requêtes JSON
app.use(express.json());

// Route pour lancer un test spécifique
app.get("/run-test/:testName", (req, res) => {
  const testName = req.params.testName;
  console.log(`Lancement du test Nightwatch: ${testName}`);

  // Construit la commande pour exécuter le test spécifique
  const command = `npx nightwatch nightwatch/tests/${testName}.js`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur d'exécution: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: error.message,
        output: stderr
      });
    }

    console.log(`Résultat des tests:\n${stdout}`);
    return res.json({
      success: true,
      output: stdout
    });
  });
});

// Route pour obtenir la liste des tests disponibles
app.get("/tests", (req, res) => {
  const testDir = path.join(__dirname, "nightwatch/tests");

  exec(`ls ${testDir}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur lors de la lecture des tests: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    // Filtrer pour n'avoir que les fichiers .js
    const tests = stdout.split('\n')
      .filter(file => file.endsWith('.js'))
      .map(file => file.replace('.js', ''));

    return res.json({
      success: true,
      tests: tests
    });
  });
});

// Route par défaut pour lancer tous les tests (compatibilité rétroactive)
app.get("/launch", (req, res) => {
  console.log("Lancement de tous les tests Nightwatch...");

  exec("npx nightwatch nightwatch/tests/", (error, stdout, stderr) => {
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
