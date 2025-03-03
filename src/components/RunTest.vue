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
    }
  } catch (error) {
    console.error("Erreur lors du chargement des tests:", error);
  }
});

// Fonction pour exécuter le test via notre serveur Express
const runTest = async () => {
  if (!testName.value) {
    alert("Veuillez sélectionner un test à exécuter.");
    return;
  }

  isLoading.value = true;
  testResult.value = "Exécution en cours...";

  try {
    const response = await fetch(`http://localhost:3001/run-test/${testName.value}`);
    const data = await response.json();

    if (data.success) {
      testResult.value = data.output;
    } else {
      testResult.value = `Erreur: ${data.error || "Une erreur est survenue"}`;
    }
  } catch (error) {
    testResult.value = "Erreur de connexion au serveur de tests.";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="run-test">
    <h2>Exécuter un Test Nightwatch</h2>

    <div class="test-selector">
      <select v-model="testName">
        <option value="">-- Sélectionnez un test --</option>
        <option v-for="test in availableTests" :key="test" :value="test">
          {{ test }}
        </option>
      </select>
      <button @click="runTest" :disabled="isLoading || !testName">
        {{ isLoading ? 'Exécution...' : 'Lancer' }}
      </button>
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

.test-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
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
