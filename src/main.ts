
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n';
import App from './App.vue'
import router from './router'

import fr from '../locales/fr.json';

const i18n = createI18n({
  legacy: false, // Utilisez le mode Composition API
  locale: 'fr', // Langue par défaut
  fallbackLocale: 'fr', // Langue de secours
  messages: {
    fr // Importez vos traductions
  }
});

const app = createApp(App)

app.use(router)
app.use(i18n);
app.mount('#app')
