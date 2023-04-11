import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/Main.vue';
import Login from '@/views/Login.vue';
import Stats from '@/views/Stats.vue';
import Edit from '@/views/Edit.vue';



const routes = [
    {path: '/',
component: Main,
name: 'Notes | Notes App'},
    {path: '/login',
component: Login,
name: 'Login | Notes App'},
    {path: '/stats',
component: Stats,
name: 'Stats | Notes App'},
    {path: '/edit/:id',
component: Edit,
name: 'Edit | Notes App'}
]
const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to) => {
    document.title = to.name;
  });

export default router