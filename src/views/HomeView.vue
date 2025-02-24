<script setup lang="ts">
import Header from '@/components/Header.vue';
// import ClientCard from '../components/ClientCard.vue';
import ClientCard2 from '@/components/ClientCard2.vue';

</script>

<template>
  <main>
    <div class="body home">
      <div class="nav">
        <Header class="home-static" />
      </div>

      <!-- <ClientCard /> -->
      <ClientCard2 />

    </div>

  </main>
</template>



<style lang="scss">

.home{
  background-color: $green-light2;
  padding: 2vh 8vw 0vh 8vw;
}

.nav {

  align-items: center;
}
</style>
