<script setup lang="ts">
import Header from '@/components/Header.vue';
import ClientCard from '../components/ClientCard.vue';

</script>

<template>
  <main>
    <div class="body-home">
      <div class="nav">
        <Header class="home-static" />
      </div>

      <ClientCard />

    </div>

  </main>
</template>



<style lang="scss">

.body-home{
 padding:2vh 8vw 0vh 8vw;
}

html {
  background-color: #B1E4D1;

}

.nav {

  align-items: center;
}
</style>
