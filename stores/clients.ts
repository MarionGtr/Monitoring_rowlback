// src/stores/clients.ts
import { defineStore } from 'pinia'

// Définir le type Client
interface Client {
  id: string
  name: string
  title?: string
  description?: string
  distinctive?: string
  flair?: string
}

export const useClientsStore = defineStore('clients', {
  state: () => ({
    clients: [
      { id: 'beauty-tech', name: 'Beauty Tech' },
      { id: 'electro-depot', name: 'Electro Dépôt' },
      { id: 'dior', name: 'Dior' }
    ], selectedClientId : null
  }),

  getters: {
    allClients: (state) => state.clients,
    getClientById: (state) => (id: string) => state.clients.find(client => client.id === id)
  },
  actions : {
    selectClient(id){
      this.selectedClientId=id;
    }
  }
})


