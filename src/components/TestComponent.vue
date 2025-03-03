<script setup lang="ts">
import { ref, onMounted } from "vue";

// Structure pour les données des tests
interface Test {
  name: string;
  description: string;
  status: "PASSED" | "FAILED" | "WARNING" | "PENDING";
  assertions: string;
  results?: string;
}

// État local des tests
const tests = ref<Test[]>([
  // {
    // name: "rowlbackEndToEndClients",
  //   description: "Vérification du flux de connexion utilisateur avec différents rôles",
  //   status: "PASSED",
  //   assertions: "20 assertions passed."
  // },
  // {
  //   name: "rowlbackResponsive",
  //   description: "Test de la fonctionnalité de recherche avancée avec filtres multiples",
  //   status: "PASSED",
  //   assertions: "20 assertions passed."
  // },
  // {
  //   name: "rowlbackSendForm",
  //   description: "Validation de l'affichage responsive sur différentes tailles d'écran",
  //   status: "FAILED",
  //   assertions: "1 assertion failed."
  // },
  // {
  //   name: "example",
  //   description: "Contrôle des animations et transitions lors du chargement de page",
  //   status: "WARNING",
  //   assertions: "4 assertions passed."
  // }
]);

// Compteurs de statistiques
const totalTests = ref(tests.value.length);
const passedTests = ref(tests.value.filter(t => t.status === "PASSED").length);
const warningTests = ref(tests.value.filter(t => t.status === "WARNING").length);
const failedTests = ref(tests.value.filter(t => t.status === "FAILED").length);

// État pour l'indication de chargement
const isLoading = ref(false);
// Test sélectionné pour afficher les détails
const selectedTest = ref<string | null>(null);

// Méthode pour exécuter un test spécifique
const runTest = async (testName: string) => {
  isLoading.value = true;

  // Mettre à jour l'état du test pour indiquer qu'il est en cours d'exécution
  const testIndex = tests.value.findIndex(t => t.name === testName);
  if (testIndex !== -1) {
    tests.value[testIndex].status = "PENDING";
  }

  try {
    const response = await fetch(`http://localhost:3001/run-test/${testName}`);
    const data = await response.json();

    if (data.success) {
      // Mettre à jour l'état du test avec les résultats
      if (testIndex !== -1) {
        tests.value[testIndex].results = data.output;

        // Analyser sommairement le résultat pour définir le statut
        if (data.output.includes("FAILED")) {
          tests.value[testIndex].status = "FAILED";
          failedTests.value++;
          if (tests.value[testIndex].status === "PASSED") passedTests.value--;
          if (tests.value[testIndex].status === "WARNING") warningTests.value--;
        } else if (data.output.includes("ERROR")) {
          tests.value[testIndex].status = "WARNING";
          warningTests.value++;
          if (tests.value[testIndex].status === "PASSED") passedTests.value--;
          if (tests.value[testIndex].status === "FAILED") failedTests.value--;
        } else {
          tests.value[testIndex].status = "PASSED";
          passedTests.value++;
          if (tests.value[testIndex].status === "WARNING") warningTests.value--;
          if (tests.value[testIndex].status === "FAILED") failedTests.value--;
        }
      }
    } else {
      // En cas d'erreur dans l'exécution du test
      if (testIndex !== -1) {
        tests.value[testIndex].status = "FAILED";
        tests.value[testIndex].results = data.error || "Erreur lors de l'exécution du test";
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'exécution du test:", error);
    if (testIndex !== -1) {
      tests.value[testIndex].status = "FAILED";
      tests.value[testIndex].results = "Erreur de connexion au serveur de tests";
    }
  } finally {
    isLoading.value = false;
  }
};

// Méthode pour afficher les détails d'un test
const showDetails = (testName: string) => {
  selectedTest.value = selectedTest.value === testName ? null : testName;
};

// Chargement initial des tests disponibles (optionnel)
onMounted(async () => {
  try {
    const response = await fetch("http://localhost:3001/tests");
    const data = await response.json();

    if (data.success && data.tests.length > 0) {
      // Mise à jour avec les vrais tests disponibles (sans écraser les données existantes)
      const availableTests = data.tests;

      // On garde les détails des tests existants et on ajoute les nouveaux
      const updatedTests = [...tests.value];

      availableTests.forEach(testName => {
        const existingTest = tests.value.find(t => t.name === testName);
        if (!existingTest) {
          updatedTests.push({
            name: testName,
            description: `Test ${testName}`,
            status: "PENDING",
            assertions: "En attente d'exécution"
          });
        }
      });

      tests.value = updatedTests;
      totalTests.value = tests.value.length;
    }
  } catch (error) {
    console.error("Erreur lors du chargement des tests disponibles:", error);
  }
});
</script>

<template>
  <main>
    <div class="bodyTest">
      <div class="headerTest">
        <div><h3>TOUS LES TESTS</h3></div>
        <div class="recapTest">
          <h3>TOTAL</h3> <h3>{{ totalTests }}</h3>
          <h4>PASSED</h4> <h3>{{ passedTests }}</h3>
          <h4>WARNING</h4> <h3>{{ warningTests }}</h3>
          <h4>FAILED</h4> <h3>{{ failedTests }}</h3>
        </div>
      </div>

      <div class="listTest">
        <ul>
          <li v-for="test in tests" :key="test.name">
            <p>{{ test.description }}</p>
            <button :class="[
              test.status === 'PASSED' ? 'statusPassed' :
              test.status === 'FAILED' ? 'statusFailed' :
              test.status === 'WARNING' ? 'statusWarning' : 'statusPending'
            ]">
              {{ test.status === 'PENDING' ? 'PENDING' : test.status }}
            </button>
            <h5>{{ test.assertions }}</h5>
            <div class="buttonTest">
              <button @click="showDetails(test.name)">DETAILS</button>
              <button @click="runTest(test.name)" :disabled="isLoading">
                {{ isLoading && selectedTest === test.name ? 'RUNNING...' : 'LAUNCH' }}
              </button>
            </div>

            <!-- Section de détails qui s'affiche lorsqu'un test est sélectionné -->
            <div v-if="selectedTest === test.name" class="testDetails">
              <h4>Détails du test : {{ test.name }}</h4>
              <pre v-if="test.results">{{ test.results }}</pre>
              <p v-else>Aucun résultat disponible. Lancez le test pour voir les détails.</p>
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
  gap: 1vw;
  align-items: center;
}

.listTest{
  padding: 3vh;
}

.buttonTest{
  display: flex;
  gap: 0.5vw;
  align-items: center;
}

.buttonTest button:hover{
  background-color: $neon;
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

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

body{
  font-size: larger;
}

/* Classes pour les états des boutons */
.status-button {
  font-weight: bold;
  color: white;
}

.statusPassed {
  background-color: $green;
}

.statusFailed {
  background-color: $red-light;
}

.statusWarning {
  background-color: $yellow;
}

.statusPending {
  background-color: #ccc;
}

/* Styles pour la section de détails */
.testDetails {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.testDetails pre {
  background-color: #333;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  overflow: auto;
  max-height: 300px;
}
</style>
