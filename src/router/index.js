import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatView from '../views/ChatView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',                 component: HomeView },
    { path: '/chat/:profileId',  component: ChatView, props: true }
  ]
})

export default router
