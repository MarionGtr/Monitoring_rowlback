<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";

// Structure pour les données des tests
interface Test {
  id: string;        // Identifiant unique pour le test (chemin relatif)
  name: string;      // Nom du test à afficher
  path: string;      // Chemin relatif complet
  description?: string; // Description du test (optionnelle)
  status: "PASSED" | "FAILED" | "WARNING" | "PENDING";
  assertions: string;
  results?: string;
  client?: string;   // Ajout du client associé au test
}

// Description par défaut pour les tests chargés dynamiquement
const getDefaultDescription = (testName: string): string => {
  return `Test ${testName.replace(/-/g, ' ').replace(/_/g, ' ')}`;
};

const route = useRoute();
const currentClientId = computed(() => route.params.id as string);

// État local des tests (sera remplacé par les tests chargés du serveur)
const allTests = ref<Test[]>([]);
const tests = computed(() => {
  // Si nous sommes sur la page d'un client spécifique, filtrer les tests
  if (currentClientId.value) {
    return allTests.value.filter(test => {
      // Utiliser le nom du client dans le chemin du test ou dans la propriété client
      const isForClient = test.client === currentClientId.value ||
        test.path.toLowerCase().includes(currentClientId.value.toLowerCase());
      return isForClient;
    });
  }
  // Sinon, retourner tous les tests
  return allTests.value;
});

// Compteurs de statistiques
const totalTests = computed(() => tests.value.length);
const passedTests = computed(() => tests.value.filter(t => t.status === "PASSED").length);
const warningTests = computed(() => tests.value.filter(t => t.status === "WARNING").length);
const failedTests = computed(() => tests.value.filter(t => t.status === "FAILED").length);

// État pour l'indication de chargement
const isLoading = ref(false);
// Test sélectionné pour afficher les détails
const selectedTest = ref<string | null>(null);

// Méthode pour exécuter un test spécifique du projet externe
const runTest = async (testId: string) => {
  isLoading.value = true;
  selectedTest.value = testId;

  // Mettre à jour l'état du test pour indiquer qu'il est en cours d'exécution
  const testIndex = allTests.value.findIndex(t => t.id === testId);
  if (testIndex !== -1) {
    // Sauvegarder le statut précédent pour les compteurs
    const previousStatus = allTests.value[testIndex].status;

    // Mettre à jour le statut
    allTests.value[testIndex].status = "PENDING";
    allTests.value[testIndex].assertions = "Test en cours d'exécution...";
  }

  try {
    const response = await fetch(`http://localhost:3001/run-test/${testId}`);
    const data = await response.json();

    if (data.success) {
      // Mettre à jour l'état du test avec les résultats
      if (testIndex !== -1) {
        allTests.value[testIndex].results = data.output;

        // Analyser les résultats pour déduire le statut et le nombre d'assertions
        let assertionsCount = 0;
        let failedAssertions = 0;

        // Compter les assertions réussies et échouées
        const assertionMatches = data.output.match(/(?:PASSED|FAILED|OK|ERROR)/g) || [];
        assertionsCount = assertionMatches.length;
        failedAssertions = (data.output.match(/(?:FAILED|ERROR)/g) || []).length;

        // Déterminer le statut global du test
        let newStatus: "PASSED" | "FAILED" | "WARNING" = "PASSED";
        if (failedAssertions > 0) {
          newStatus = "FAILED";
        } else if (data.output.includes("Error") || data.output.includes("WARNING")) {
          newStatus = "WARNING";
        }

        // Mettre à jour le test
        allTests.value[testIndex].status = newStatus;
        allTests.value[testIndex].assertions = failedAssertions > 0
          ? `${failedAssertions} assertion(s) échouée(s) sur ${assertionsCount}`
          : `${assertionsCount} assertion(s) réussie(s)`;
      }
    } else {
      // En cas d'erreur dans l'exécution du test
      if (testIndex !== -1) {
        allTests.value[testIndex].status = "FAILED";
        allTests.value[testIndex].results = data.error || "Erreur lors de l'exécution du test";
        allTests.value[testIndex].assertions = "Échec de l'exécution";
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'exécution du test:", error);
    if (testIndex !== -1) {
      allTests.value[testIndex].status = "FAILED";
      allTests.value[testIndex].results = "Erreur de connexion au serveur de tests";
      allTests.value[testIndex].assertions = "Erreur de connexion";
    }
  } finally {
    isLoading.value = false;
  }
};

// Méthode pour afficher les détails d'un test
const showDetails = (testName: string) => {
  selectedTest.value = selectedTest.value === testName ? null : testName;
};

// Extraire le client à partir du chemin du test
const getClientFromPath = (path: string): string | null => {
  // Si le chemin contient un des noms de clients connus, on l'associe à ce client
  const clientNames = [
    "rowlback", "beauty-tech", "electro-depot", "dior", "tag-heuer", 
    "guerlain", "motoblouz", "nacon", "vds", "bigben", "viseo", 
    "grande-epicerie", "groupe-fremeaux", "SDG-distribution"
  ];
  
  const lowerPath = path.toLowerCase();
  
  for (const clientName of clientNames) {
    if (lowerPath.includes(clientName.toLowerCase())) {
      return clientName;
    }
  }
  
  return null;
};

// Chargement initial des tests disponibles du projet externe
onMounted(async () => {
  try {
    // Afficher un état de chargement
    isLoading.value = true;

    const response = await fetch("http://localhost:3001/tests");
    const data = await response.json();

    if (data.success && data.tests.length > 0) {
      // Transformation des données de tests reçues
      const externalTests = data.tests.map(test => {
        // Essayer de déterminer le client associé au test
        const client = test.client || getClientFromPath(test.path);
        
        return {
          id: test.id,
          name: test.name,
          path: test.path,
          description: getDefaultDescription(test.name),
          status: "PENDING",
          assertions: "En attente d'exécution",
          client: client
        };
      });

      // Remplacer complètement les tests avec ceux du projet externe
      allTests.value = externalTests;

      console.log(`${externalTests.length} tests chargés depuis le projet externe`);
    } else {
      console.warn("Aucun test n'a été trouvé dans le projet externe");
    }
  } catch (error) {
    console.error("Erreur lors du chargement des tests disponibles:", error);
    // Afficher un message d'erreur dans l'interface
    allTests.value = [{
      id: "error",
      name: "Erreur de chargement",
      path: "",
      description: "Impossible de charger les tests du projet externe. Vérifiez la configuration du serveur.",
      status: "FAILED",
      assertions: "Erreur de connexion"
    }];
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <main>
    <div class="bodyTest">
      <div class="headerTest">
        <div><h3>TESTS {{ currentClientId ? `POUR ${currentClientId.toUpperCase()}` : 'TOUS LES TESTS' }}</h3></div>
        <div class="recapTest">
          <h3>TOTAL</h3> <h3>{{ totalTests }}</h3>
          <h4>PASSED</h4> <h3>{{ passedTests }}</h3>
          <h4>WARNING</h4> <h3>{{ warningTests }}</h3>
          <h4>FAILED</h4> <h3>{{ failedTests }}</h3>
        </div>
      </div>

      <!-- Indicateur de chargement initial -->
      <div v-if="isLoading && tests.length === 0" class="loading-indicator">
        <p>Chargement des tests du projet externe...</p>
      </div>

      <!-- Message si aucun test n'est trouvé -->
      <div v-else-if="tests.length === 0" class="no-tests-found">
        <p>Aucun test n'a été trouvé {{ currentClientId ? `pour le client ${currentClientId}` : 'dans le projet externe' }}.</p>
        <p v-if="!currentClientId">Vérifiez le chemin configuré dans server.js (EXTERNAL_NIGHTWATCH_PROJECT).</p>
      </div>

      <!-- Liste des tests -->
      <div v-else class="listTest">
        <ul>
          <li v-for="test in tests" :key="test.id">
            <div class="test-header">
              <p class="test-name">{{ test.name }}</p>
              <span class="test-path">{{ test.path }}</span>
              <span v-if="test.client" class="test-client">Client: {{ test.client }}</span>
            </div>
            <p class="test-description">{{ test.description }}</p>
            <button :class="[
              test.status === 'PASSED' ? 'statusPassed' :
              test.status === 'FAILED' ? 'statusFailed' :
              test.status === 'WARNING' ? 'statusWarning' : 'statusPending'
            ]">
              {{ test.status === 'PENDING' ? 'PENDING' : test.status }}
            </button>
            
            <div class="buttonTest">
              <button @click="showDetails(test.id)">DETAILS</button>
              <button @click="runTest(test.id)" :disabled="isLoading && selectedTest === test.id">
                {{ isLoading && selectedTest === test.id ? 'RUNNING...' : 'LAUNCH' }}
              </button>
            </div>

            <!-- Section de détails qui s'affiche lorsqu'un test est sélectionné -->
            <div v-if="selectedTest === test.id" class="testDetails">
              <h4>Détails du test : {{ test.name }}</h4>
              <p><strong>Chemin:</strong> {{ test.path }}</p>
              <p><strong>Mode:</strong> Headless (sans interface graphique)</p>
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
.headless-badge {
  display: inline-block;
  background-color: $neon;
  color: $onyx;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-top: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

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
  gap: 2vw;
  align-items: center;
  flex-wrap: wrap;
}

li p{
  width: 4vw;
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
  font-size: large;
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

/* Nouveaux styles pour les tests externes */
.test-header {
  display: flex;
  flex-direction: column;
  width: 20vw;
}

.test-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.test-path {
  font-size: 0.8em;
  color: #666;
  margin-bottom: 5px;
}

.test-client {
  font-size: 0.8em;
  color: #007bff;
  font-weight: bold;
}

.test-description {
  font-style: italic;
  color: #555;
  width: 20vw;
}

/* Indicateur de chargement */
.loading-indicator {
  text-align: center;
  padding: 30px;
  font-size: 1.2em;
  color: #555;
}

.no-tests-found {
  text-align: center;
  padding: 30px;
  color: #d9534f;
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

/* Statut en attente */
.statusPending {
  background-color: #ccc;
  animation: pulse 1.5s infinite alternate;
}

@keyframes pulse {
  from { opacity: 0.7; }
  to { opacity: 1; }
}
</style>