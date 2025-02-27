<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

// Définir les props si nécessaire
const props = defineProps({
  // Vous pouvez ajouter des props si besoin
});

const { t } = useI18n();

// Extraire dynamiquement les clients du fichier de traduction
const clients = computed(() => {
  const result = [];

  try {
    // Vérifiez si t.value existe et est un objet avant d'appeler Object.keys
    if (t.value && typeof t.value === 'object') {
      const prefix = 'customers.';

      // Trouver tous les IDs de clients
      const clientIds = new Set();

      Object.keys(t.value).forEach(key => {
        if (key.startsWith(prefix)) {
          const parts = key.split('.');
          if (parts.length >= 2) {
            clientIds.add(parts[1]);
          }
        }
      });

      // Pour chaque ID, récupérer le nom du client
      Array.from(clientIds).forEach(id => {
        const name = t(`customers.${id}.name`);
        if (name && name !== `customers.${id}.name`) { // Vérifier que la traduction existe
          result.push({
            id,
            name
          });
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'extraction des clients:', error);
  }

  return result;
});

// Liste statique des clients pour garantir l'affichage même en cas de problème avec les traductions
const staticClients = [
  { id: 'beauty-tech', name: 'Beauty Tech' },
  { id: 'electro-depot', name: 'Electro Dépôt' },
  { id: 'dior', name: 'Dior' },
  { id: 'tag-heuer', name: 'Tag Heuer' },
  { id: 'guerlain', name: 'Guerlain' },
  { id: 'motoblouz', name: 'Motoblouz' },
  { id: 'nacon', name: 'Nacon' },
  { id: 'vds', name: 'Vanderschooten' },
  { id: 'bigben', name: 'Bigben' },
  { id: 'viseo', name: 'Viseo' },
  { id: 'grande-epicerie', name: 'La Grande Epicerie' },
  { id: 'groupe-fremeaux', name: 'Fremaux Delorme' },
  { id: 'SDG-distribution', name: 'SDG Distribution' },
  { id: 'Rowlback', name: 'Rowlback' }
];

// Utiliser les clients dynamiques si disponibles, sinon utiliser la liste statique
const allClients = computed(() => {
  return clients.value.length > 0 ? clients.value : staticClients;
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
