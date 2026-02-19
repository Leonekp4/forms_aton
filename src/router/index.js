// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import ChecklistForm from '../views/ChecklistForm.vue' // Seu App.vue original renomeado
import Dashboard from '../views/Dashboard.vue'       // A view que criei anteriormente

const routes = [
  {
    path: '/',
    name: 'Checklist',
    component: ChecklistForm
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router