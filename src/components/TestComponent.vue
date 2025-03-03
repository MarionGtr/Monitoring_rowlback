<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Test {
  id: string;
  name: string;
  status: "PASSED" | "FAILED" | "WARNING";
  assertions: string;
  isRunning: boolean;
  result?: string;
}

const tests = ref<Test[]>([
  {
    id: "loginFlowTest",
    name: "Vérification du flux de connexion utilisateur avec différents rôles",
    status: "PASSED",
    assertions: "20 assertions passed.",
    isRunning: false
  },
  {
    id: "advancedSearchTest",
    name: "Test de la fonctionnalité de recherche avancée avec filtres multiples",
    status: "PASSED",
    assertions: "20 assertions passed.",
    isRunning: false
  },
  {
    id: "responsiveTest",
    name: "Validation de l'affichage responsive sur différentes tailles d'écran",
    status: "FAILED",
    assertions: "1 assertion failed.",
    isRunning: false
  },
  {
    id: "animationsTest",
    name: "Contrôle des animations et transitions lors du chargement de page",
    status: "WARNING",
    assertions: "4 assertions passed.",
    isRunning: false
  }
]);

const totals = ref({
  total: 4,
  passed: 2,
  warning: 1,
  failed: 1
});

// Fonction pour mettre à jour les statistiques
const updateTotals = () => {
  totals.value.passed = tests.value.filter(test => test.status === "PASSED").length;
  totals.value.warning = tests.value.filter(test => test.status === "WARNING").length;
  totals.value.failed = tests.value.filter(test => test.status === "FAILED").length;
  totals.value.total = tests.value.length;
};

// Fonction pour exécuter un test spécifique
const runTest = async (testId: string) => {
  // Trouver le test correspondant
  const test = tests.value.find(t => t.id === testId);
  if (!test) return;

  // Marquer le test comme en cours d'exécution
  test.isRunning = true;

  try {
    // Appeler le point d'API pour lancer le test
    // Pour le moment, utilisons l'endpoint existant, mais à terme vous pouvez adapter
    // pour appeler un endpoint spécifique par test
    const response = await fetch(`http://localhost:3001/launch?testId=${testId}`);
    const result = await response.text();

    // Mettre à jour le résultat et le statut du test
    test.result = result;

    // Analyser le résultat pour mettre à jour le statut (exemple simplifié)
    if (result.toLowerCase().includes("error") || result.toLowerCase().includes("failed")) {
      test.status = "FAILED";
      test.assertions = "Test échoué. Voir les détails.";
    } else {
      test.status = "PASSED";
      test.assertions = "Test réussi.";
    }
  } catch (error) {
    // En cas d'erreur
    test.result = "Erreur lors de l'exécution du test.";
    test.status = "FAILED";
    test.assertions = "Erreur de connexion au serveur de test.";
  } finally {
    // Fin de l'exécution
    test.isRunning = false;
    // Mettre à jour les totaux
    updateTotals();
  }
};

// Fonction pour afficher/cacher les détails d'un test
const showDetails = ref<Record<string, boolean>>({});

const toggleDetails = (testId: string) => {
  showDetails.value[testId] = !showDetails.value[testId];
};

// Initialisation
onMounted(() => {
  updateTotals();
});

</script>

<template>
  <main>
    <div class="bodyTest">
      <div class="headerTest">
        <div><h3>TOUS LES TESTS</h3></div>
        <div class="recapTest">
          <h3>TOTAL</h3> <h3>{{ totals.total }}</h3>
          <h4>PASSED</h4> <h3>{{ totals.passed }}</h3>
          <h4>WARNING</h4> <h3>{{ totals.warning }}</h3>
          <h4>FAILED</h4> <h3>{{ totals.failed }}</h3>
        </div>
      </div>

      <div class="listTest">
        <ul>
          <li v-for="test in tests" :key="test.id">
            <p>{{ test.name }}</p>
            <button :class="'status' + test.status">{{ test.status }}</button>
            <h5>{{ test.assertions }}</h5>
            <div class="buttonTest">
              <button @click="toggleDetails(test.id)">DETAILS</button>
              <button @click="runTest(test.id)" :disabled="test.isRunning">
                {{ test.isRunning ? 'RUNNING...' : 'LAUNCH' }}
              </button>
            </div>

            <!-- Détails du test (conditionnellement affichés) -->
            <div v-if="showDetails[test.id]" class="test-details">
              <h4>Détails du test :</h4>
              <pre>{{ test.result || 'Aucun résultat disponible. Lancez le test d\'abord.' }}</pre>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.bodyTest {
  background-color: $blue;
  display: flex;
  justify-content: center;
  height: fit-content;
  border-radius: 20px;
  flex-direction: column;
}

.headerTest {
  display: flex;
  justify-content: center;
  gap: 20vw;
}

.recapTest{
  display: flex;
  gap:1vw;
  align-items: center;
}

.listTest{
  padding: 3vh;
}

.buttonTest{
  display: flex;
  gap : 0.5vw;
  align-items: center;
}

.buttonTest button:hover{
  background-color: $neon;
}

.buttonTest button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.backButton a{
  text-decoration: none;
}

.backButton{
  margin-left: 5vw;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 2vh;
}

li {
  display: flex;
  gap: 4vw;
  align-items: center;
  flex-wrap: wrap;
}

li h5{
  display: flex;
  width: 10vw;
  align-items: center;
}

li p{
  width: 30vw;
}

button {
  padding: 3px;
  border-radius: 15px;
  height: 4vh;
  width: 5vw;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

body{
  font-size: larger;
}

/* Classes pour les états des boutons */
.status-button {
  font-weight: bold;
  color: white;
}

.statusPASSED {
  background-color: $green;
}

.statusFAILED {
  background-color: $red-light;
}

.statusWARNING {
  background-color: $yellow;
}

/* Styles pour les détails des tests */
.test-details {
  width: 100%;
  margin-top: 10px;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
}

.test-details pre {
  width: 100%;
  white-space: pre-wrap;
  font-family: monospace;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: white;
  font-size: 0.9em;
  overflow-x: auto;
}
</style>
