<script setup lang="ts">
import Header from '@/components/Header.vue';
import TestComponent from '../components/TestComponent.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed } from "vue";
import { useI18n } from 'vue-i18n';

const { t, te } = useI18n();
const route = useRoute();
const router = useRouter();
const customerId = computed(() => route.params.id as string);

// Récupérer les détails du client depuis les fichiers de traduction
const clientDetails = computed(() => {
  if (customerId.value && te(`customers.${customerId.value}`)) {
    return {
      name: t(`customers.${customerId.value}.name`),
      title: t(`customers.${customerId.value}.title`),
      description: t(`customers.${customerId.value}.description`)
    };
  }
  return {
    name: customerId.value,
    title: "",
    description: ""
  };
});

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
        
        <div class="client-info">
          <h2>{{ clientDetails.name }}</h2>
          <p v-if="clientDetails.title" class="client-title">{{ clientDetails.title }}</p>
          <p v-if="clientDetails.description" class="client-description">{{ clientDetails.description }}</p>
        </div>

        <h3 class="tests-header">Tests pour {{ clientDetails.name }}</h3>
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

.detailsContent {
  display: flex;
  flex-direction: column;
}

.client-info {
  background-color: white;
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin-top: 0;
    color: $onyx;
    font-size: 2rem;
  }
  
  .client-title {
    font-weight: 600;
    color: #555;
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  .client-description {
    color: #666;
    line-height: 1.6;
  }
}

.tests-header {
  margin-bottom: 1rem;
  font-weight: 600;
  color: $onyx;
  font-size: 1.5rem;
}
</style>