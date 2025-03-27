<script setup lang="ts">
import { ref, onMounted } from "vue";

const testName = ref(""); // Nom du test à exécuter
const testResult = ref(""); // Résultat du test
const isLoading = ref(false);
const availableTests = ref([]);

// Charger la liste des tests disponibles
onMounted(async () => {
  try {
    const response = await fetch("http://localhost:3001/tests");
    const data = await response.json();
    if (data.success) {
      availableTests.value = data.tests;
      console.log("Tests disponibles chargés:", availableTests.value.length);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des tests:", error);
    testResult.value = "Erreur de connexion au serveur de tests. Vérifiez que le serveur est en cours d'exécution.";
  }
});

// Fonction pour exécuter le test via notre serveur Express
const runTest = async () => {
  if (!testName.value) {
    alert("Veuillez sélectionner un test à exécuter.");
    return;
  }

  isLoading.value = true;
  testResult.value = "Exécution en cours en mode headless...";

  try {
    console.log(`Lancement du test: ${testName.value} en mode headless`);
    const response = await fetch(`http://localhost:3001/run-test/${testName.value}`);
    const data = await response.json();

    if (data.success) {
      testResult.value = data.output;
      
      // Analyser les résultats pour une meilleure présentation
      if (data.output.includes("PASSED")) {
        console.log("Test réussi!");
      } else if (data.output.includes("FAILED")) {
        console.log("Test échoué!");
      }
    } else {
      testResult.value = `Erreur: ${data.error || "Une erreur est survenue"}`;
      console.error("Erreur lors de l'exécution du test:", data.error);
    }
  } catch (error) {
    testResult.value = "Erreur de connexion au serveur de tests. Vérifiez que le serveur est en cours d'exécution.";
    console.error("Erreur de connexion:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="run-test">
    <h2>Exécuter un Test Nightwatch <span class="headless-badge">Mode Headless</span></h2>

    <div class="test-selector">
      <select v-model="testName">
        <option value="">-- Sélectionnez un test --</option>
        <option v-for="test in availableTests" :key="test.id" :value="test.id">
          {{ test.name }}
        </option>
      </select>
      <button @click="runTest" :disabled="isLoading || !testName">
        {{ isLoading ? 'Exécution...' : 'Lancer' }}
      </button>
    </div>

    <div class="test-info">
      <p>Tests exécutés automatiquement en mode headless (sans interface graphique).</p>
    </div>

    <div v-if="testResult" class="test-result">
      <h3>Résultat :</h3>
      <pre>{{ testResult }}</pre>
    </div>
  </div>
</template>

<style scoped>
.run-test {
  margin-top: 20px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
}

.headless-badge {
  display: inline-block;
  background-color: #f8f88f;
  color: #333;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 10px;
  vertical-align: middle;
}

.test-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.test-info {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  font-style: italic;
}

select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  flex-grow: 1;
}

button {
  padding: 8px 16px;
  background-color: #f8f88f;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #f0f060;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.test-result {
  margin-top: 20px;
  background: #333;
  color: #fff;
  padding: 15px;
  border-radius: 5px;
}

pre {
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
}
</style>
