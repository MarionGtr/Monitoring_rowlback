import express from "express";
import cors from "cors";  // <-- Ajoute ceci
import { exec } from "child_process";

const app = express();
const PORT = 3001;

app.use(cors()); // <-- Active CORS pour toutes les requêtes

app.get("/launch", (req, res) => {
  console.log("Lancement du test Nightwatch...");

  exec("node run-rowlbackEndToEndTeam.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur : ${stderr}`);
      res.status(500).send(`Erreur : ${stderr}`);
      return;
    }
    console.log(`Résultat des tests :\n${stdout}`);
    res.send(stdout);
  });
});

app.listen(PORT, () => {
  console.log(`Serveur de test en écoute sur http://localhost:${PORT}`);
});

