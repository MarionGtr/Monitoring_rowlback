import { exec } from "child_process";

const command = `npx nightwatch nightwatch/tests/rowlback/rowlbackEndToEndClients.js`;

console.log(`Exécution du test : ${command}`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erreur : ${stderr}`);
    return;
  }
  console.log(`Résultat des tests :\n${stdout}`);
});

