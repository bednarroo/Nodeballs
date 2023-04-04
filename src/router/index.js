import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/Main.vue';
import Login from '@/views/Login.vue';
import Stats from '@/views/Stats.vue';
import Edit from '@/views/Edit.vue';

const routes = [
    {path: '/',
component: Main,
name: 'Main'},
    {path: '/login',
component: Login,
name: 'Login'},
    {path: '/stats',
component: Stats,
name: 'Stats'},
    {path: '/edit/:id',
component: Edit,
name: 'Edit'}
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router