<script setup lang="ts">

import Header from '@/components/Header.vue';
import TestComponent from '../components/TestComponent.vue';
import {useRoute} from 'vue-router';
import { computed } from "vue";


const route = useRoute();
const customerId = computed(() => route.params.id as string);
const name = computed(() => t(`customers.${customerId.value}.name`));


</script>

<template>
  <div class="body details">
    <main>
      <Header />
    </main>
      <h2>{{ name }}</h2>
    <TestComponent />
  </div>
</template>


<style lang="scss">
.details {
  background-color: $blue-light;
  padding: 2vh 8vw 0vh 8vw;
}
</style>
