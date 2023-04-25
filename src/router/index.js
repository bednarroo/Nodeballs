import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/Main.vue';
import Login from '@/views/Login.vue';
import Stats from '@/views/Stats.vue';
import Edit from '@/views/Edit.vue';
import Documentation from '@/views/Documentation.vue';
import {useAuthStore} from "@/stores/auth.js"




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
name: 'Edit | Notes App'},
    {path: '/documentation',
component: Documentation,
name: 'Documentation | Notes App'}
]
const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async(to) => {
    const auth = useAuthStore();

    if (!auth.user.id && to.name !== 'Login | Notes App'){
        return {
            name:"Login | Notes App"
        }
    }
    if (auth.user.id && to.name === 'Login | Notes App'){
        return {
            name: false
        }
    }

    document.title = to.name;
  });

export default router