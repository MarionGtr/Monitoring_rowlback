<script setup lang="ts">

import Header from '@/components/Header.vue';
import TestComponent from '../components/TestComponent.vue';

</script>

<template>
  <div class="body details">
    <main>
      <Header />
    </main>

    <TestComponent />
  </div>
</template>


<style lang="scss">
.details {
  background-color: $blue-light;
  padding: 2vh 8vw 0vh 8vw;
}
</style>
