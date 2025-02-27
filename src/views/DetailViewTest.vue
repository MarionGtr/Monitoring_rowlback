<script setup lang="ts">
import Header from '@/components/Header.vue';
import TestComponent from '../components/TestComponent.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed } from "vue";

const route = useRoute();
const router = useRouter();
const customerId = computed(() => route.params.id as string);

// Fonction pour retourner à la liste des clients
const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="body details">
    <main>
      <Header />
      <div class="detailsContent">
      <div class="backButton" @click="goBack">← Retour à la liste</div>

      <TestComponent />
    </div>
    </main>
  </div>
</template>

<style lang="scss">
.details {
  background-color: $blue-light;
  padding: 2vh 8vw 0vh 8vw;

  .backButton {
    display: inline-block;
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    background-color: #f8f88f;
    border-radius: 15px;
    cursor: pointer;
    transition: background-color 0.2s;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    margin-left: 0;
    width: fit-content;

    &:hover {
      background-color: $yellow;
    }
  }
}

.detailsContent{
  display: flex;
  flex-direction: column;
  
}
</style>
