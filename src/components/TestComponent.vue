<script setup lang="ts">
import { ref } from "vue";

const testResult = ref("");

const runTest = async () => {
  try {
    const response = await fetch("http://localhost:3001/launch");
    testResult.value = await response.text();
  } catch (error) {
    testResult.value = "Erreur lors de l'exécution du test.";
  }
};


</script>

<template>
  <main>


  <div class="bodyTest">
    <div class="headerTest">
      <div><h3>TOUS LES TESTS</h3></div>
      <div class="recapTest"><h3>TOTAL</h3> <h3>2</h3><h4>PASSED</h4> <h3>1</h3><h4>WARNING</h4> <h3>1</h3><h4>FAILED</h4></div>
    </div>

    <div class="listTest">
      <ul>
        <li>
        <p>Vérification du flux de connexion utilisateur avec différents rôles</p>
        <button class="statusPassed">PASSED</button>
        <h5>20 assertions passed.</h5>
        <div class="buttonTest">
          <button >DETAILS</button>
          <button @click="runTest">LAUNCH</button>
          <p v-if="testResult">Résultat : {{ testResult }}</p>
        </div>
      </li>

        <li>
          <p>Test de la fonctionnalité de recherche avancée avec filtres multiples</p>
          <button class="statusPassed">PASSED</button>
          <h5>20 assertions passed.</h5>
            <div class="buttonTest">
          <button>DETAILS</button>
          <button>LAUNCH</button>
            </div>
        </li>

        <li>
          <p>Validation de l'affichage responsive sur différentes tailles d'écran</p>
          <button class="statusFailed">FAILED</button>
          <h5>1 assertion failed.</h5>
            <div class="buttonTest">
          <button>DETAILS</button>
          <button>LAUNCH</button>
            </div>
        </li>

        <li>
          <p>Contrôle des animations et transitions lors du chargement de page"</p>
          <button class="statusWarning">WARNING</button>
          <h5>4 assertions passed.</h5>
            <div class="buttonTest">
          <button>DETAILS</button>
          <button>LAUNCH</button>
            </div>
        </li>
      </ul>
    </div>
    <div></div>
  </div>
</main>
</template>

<style lang="scss">
.bodyTest {
  background-color: $blue;
  display: flex;
  justify-content: center;
  margin: 2vw;
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

.statusPassed {
  background-color: $green;

}

.statusFailed {
  background-color: $red-light;

}

.statusWarning {
  background-color: $yellow;

}

@media(min-width:2000px){
  .bodyTest {
  background-color: $blue;
  display: flex;

  justify-content: center;
  margin: 3vw;
  height: fit-content;
  border-radius: 20px;
  flex-direction: column;
}

.headerTest {
  display: flex;
  justify-content: center;
  gap: 20vw;
  font-size: 3vh;
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
  background-color: rgb(226, 216, 216);
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
}

li h5{
  display: flex;
  width: 10vw;
  align-items: center;
}

li p{
  width: 30vw;
  font-size: larger;
}

button {
  padding: 3px;
  border-radius: 15px;
  height: 4vh;
  width: 5vw;
  font-size: 1vh;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

body{
  font-size:xx-large;
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
}
</style>
