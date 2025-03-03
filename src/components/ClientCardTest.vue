<script setup lang="ts">
import fr from "@/locales/fr.json";

// Extraire les clients du fichier JSON
const customers = fr.customers;
</script>

<template>
  <div class="customerPanel">
    <!-- Générer dynamiquement les liens pour tous les clients -->
    <router-link v-for="(client, id) in customers" :key="id" 
      :class="['customer', 'customer--view', id]" 
      :to="`/detail/${id}`">
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
    background-color: yellow;
    border: 2px solid yellow;
  }
}

.customerName {
  color: black;
  font-size: 1.4rem;
  text-align: center;
  padding: 1rem;
  border-radius: 0.5rem;
}
</style>
