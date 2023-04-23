

<template>
<Navbar></Navbar>
<div class="container is-max-desktop main-content">
    <RouterView ></RouterView>
</div>
<Footer></Footer>
</template>

<script setup>

import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';


const auth = useAuthStore();

onMounted(()=>{
    auth.init()
})

</script>


<style lang = "scss">
@import "bulma/css/bulma.css";
body{
    padding-top: 85px ;
}
</style>