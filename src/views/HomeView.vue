<script setup lang="ts">
import Header from '@/components/Header.vue';
import ClientCard from '../components/ClientCard.vue';

</script>

<template>
  <main>
    <div class="body-home">
      <div class="nav">
        <Header :show-logo="true" class="home-static" />
      </div>
      
        <ClientCard />

    </div>

  </main>
</template>

<style lang="scss">
html {
  background-color: #B1E4D1;

}

.nav{
  
}
</style>
