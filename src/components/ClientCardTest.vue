<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, te } = useI18n();

// Cette fonction extrait tous les clients du fichier de traduction
const getClientIds = () => {
  // On stocke les IDs des clients
  const clientIds = [];

  // On obtient toutes les clés qui commencent par "customers."
  const allKeys = Object.keys(t.value || {});

  // On parcourt les clés pour trouver les IDs des clients
  allKeys.forEach(key => {
    if (key.startsWith('customers.')) {
      const parts = key.split('.');
      if (parts.length >= 2 && !clientIds.includes(parts[1])) {
        clientIds.push(parts[1]);
      }
    }
  });

  return clientIds;
};

// Liste des clients avec leurs données
const clients = computed(() => {
  const clientIds = getClientIds();

  return clientIds.map(id => ({
    id,
    name: t(`customers.${id}.name`),
    title: t(`customers.${id}.title`),
    description: t(`customers.${id}.description`),
    distinctive: t(`customers.${id}.distinctive`),
    flair: t(`customers.${id}.flair`)
  }));
});

// Liste de secours au cas où l'extraction des traductions échoue
const fallbackClients = [
  { id: 'beauty-tech', name: 'Beauty Tech' },
  { id: 'electro-depot', name: 'Electro Dépôt' }
  // Ajoutez d'autres clients au besoin
];

// On utilise les clients extraits des traductions ou la liste de secours
const allClients = computed(() => {
  return clients.value.length > 0 ? clients.value : fallbackClients;
});
</script>

<template>


  <div class="customerPanel">
    <!-- Générer dynamiquement les liens pour tous les clients -->
    <router-link
      v-for="client in allClients"
      :key="client.id"
      :class="['customer', 'customer--view', client.id]"
      :to="`/detail/${client.id}`"
    >
      <span class="customerName">{{ client.name }}</span>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>

.customerPanel {

gap: 0.6vw;
display: flex;
justify-content: flex-start;
align-items: center;
flex-wrap: wrap;
// background-color: $green-light;
// border-radius: 20px;
}


.customer {
display: flex;
justify-content: center;
align-items: center;
position: relative;
height: 8rem;
width: 14rem;
margin: 1rem;
border-radius: 30px;
border: 2px solid #f8f88f;
text-decoration: none;
transition: transform 0.3s ease;
background-color: #f8f88f;
box-shadow: 2px 2px 6px 0px #817c7c;

&:hover {
    transform: scale(1.05);
    background-color: $yellow;
    border: 2px solid $yellow;

}

}

.customerName {
color: $onyx;
font-size: 1.4rem;
text-align: center;
padding: 1rem;
border-radius: 0.5rem;
}
</style>
