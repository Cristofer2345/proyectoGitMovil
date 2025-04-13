import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../pagina/HomePage.vue';
import Register from '../pagina/Register.vue';
import Login from '../pagina/Login.vue';
import Welcome from '../pagina/Welcome.vue';

const routes = [
  { path: '/', redirect: '/welcome' },
  { path: '/login', component: Login },
  { path: '/register', component: Register }, 
  { path: '/home', component: HomePage },
  { path: '/welcome', component: Welcome },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
