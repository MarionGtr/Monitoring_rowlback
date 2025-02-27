import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetailViewTest from '@/views/DetailViewTest.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },


    {
      path: '/detail/:id',
      name: 'detail',
      component: DetailViewTest,
    }


  ],
})

export default router
