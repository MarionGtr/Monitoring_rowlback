<script setup lang="ts">
import Header from '@/components/Header.vue';
// import ClientCard from '../components/ClientCard.vue';
import ClientCardTest from '@/components/ClientCardTest.vue';

</script>

<template>
  <div class="body home">
    <main>

      <div class="nav">
        <Header class="home-static" />
      </div>

      <div class="titleHome">
        <p>Tests Nightwatch</p>
        <p>Résultats globaux</p>
      </div>

      <div class="bodyElements">
        <div class="cardPanel">
          <ClientCardTest />
        </div>
        <div class="stat">
          <span>Nombre de tests réalisés</span>
          <h1>15</h1>
          <span>Nombre de tests échoués</span>
          <h1>2</h1>
          <span>Temps de réponse moyen</span>
          <h1>8ms</h1>
        </div>
      </div>

    </main>
  </div>
</template>



<style lang="scss">
.home {
  background-color: $green-light2;
  padding: 2vh 8vw 0vh 8vw;
}

.titleHome {
  font-size: 3vw;
  padding-top: 2vh;
  border-bottom: 1px solid black;
  margin-bottom: 0;
  padding-bottom: 0;
  display: flex;
  justify-content: space-between;
}

.titleHome p {
  margin: 0.8vh;
}

.nav {
  align-items: center;
}

.bodyElements {
  display: flex;
  flex-direction: row;
}

.cardPanel {
  padding-top: 2vw;
  width: 60%;
}

.stat {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vw;
  margin-top: 3vw;
  font-size: 1.6rem;
  background-color: $green-light;
  border-radius: 20px;
  padding-top:4vw;
  padding-bottom: 4vw;
  max-height: fit-content;


}
</style>
