<script setup lang="ts">
import { ref } from "vue";

const testName = ref(""); // Nom du test à exécuter
const testResult = ref(""); // Résultat du test
const isLoading = ref(false);

// Fonction pour exécuter le test via un script Node.js
const runTest = async () => {
  if (!testName.value) {
    alert("Veuillez entrer un nom de test.");
    return;
  }

  isLoading.value = true;
  testResult.value = "Exécution en cours...";

  try {
    // Appel du script Node.js (via un serveur local ou un fichier bash)
    const response = await fetch(`http://localhost:5173/run-test?test=${testName.value}`);
    const data = await response.text();
    testResult.value = data;
  } catch (error) {
    testResult.value = "Erreur lors de l'exécution du test.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="run-test">
    <h2>Exécuter un Test Nightwatch</h2>
    <input v-model="testName" placeholder="Nom du test" />
    <button @click="runTest" :disabled="isLoading">Lancer</button>

    <div v-if="testResult" class="test-result">
      <h3>Résultat :</h3>
      <pre>{{ testResult }}</pre>
    </div>
  </div>
</template>

<style scoped>
.run-test {
  margin-top: 20px;
}

input {
  padding: 8px;
  margin-right: 10px;
}

button {
  padding: 8px;
  cursor: pointer;
}

.test-result {
  margin-top: 20px;
  background: #f3f3f3;
  padding: 10px;
  border-radius: 5px;
}
</style>
