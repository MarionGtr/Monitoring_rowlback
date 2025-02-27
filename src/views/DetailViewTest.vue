<script setup lang="ts">
import Header from '@/components/Header.vue';
import TestComponent from '../components/TestComponent.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watch, onMounted } from "vue";
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const customerId = computed(() => route.params.id as string);
const { t, te } = useI18n();

// Vérifier si le client existe dans notre fichier de traduction
const clientExists = computed(() => {
  return te(`customers.${customerId.value}.name`);
});

// Rediriger si le client n'existe pas
onMounted(() => {
  if (!clientExists.value && customerId.value) {
    console.warn(`Client "${customerId.value}" non trouvé dans les traductions.`);
    // Vous pouvez soit rediriger, soit afficher un message d'erreur
    // router.push('/');
  }
});

// Récupérer les informations du client depuis le fichier de traduction
const name = computed(() => t(`customers.${customerId.value}.name`));
const title = computed(() => t(`customers.${customerId.value}.title`));
const description = computed(() => t(`customers.${customerId.value}.description`));
const distinctive = computed(() => t(`customers.${customerId.value}.distinctive`));
const flair = computed(() => t(`customers.${customerId.value}.flair`));

// Fonction pour retourner à la liste des clients
const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="body details">
    <main>
      <Header />
      <div class="back-button" @click="goBack">← Retour à la liste</div>

      <div v-if="clientExists" class="client-details">
        <h1 class="client-name">{{ name }}</h1>
      </div>

      <div v-else class="client-not-found">
        <h2>Client non trouvé</h2>
        <p>Désolé, nous n'avons pas trouvé d'informations pour le client "{{ customerId }}".</p>
      </div>

      <TestComponent />
    </main>
  </div>
</template>

<style lang="scss">
.details {
  background-color: $blue-light;
  padding: 2vh 8vw 0vh 8vw;

  .back-button {
    display: inline-block;
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    background-color: #f8f88f;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: $yellow;
    }
  }

  .client-details {
    margin: 2rem 0;

    .client-name {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .client-title {
      margin-bottom: 2rem;

      h2 {
        font-size: 1.8rem;
        color: #555;
      }
    }

    .client-description, .client-distinctive, .client-flair {
      margin-bottom: 1.5rem;

      h3 {
        font-size: 1.3rem;
        margin-bottom: 0.5rem;
      }

      p {
        line-height: 1.6;
      }
    }

    .client-flair {
      p {
        font-size: 1.2rem;
      }
    }
  }

  .client-not-found {
    text-align: center;
    margin: 3rem 0;

    h2 {
      color: #e74c3c;
    }
  }
}
</style>
