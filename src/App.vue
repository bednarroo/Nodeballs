<script setup>
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
<Navbar></Navbar>
<div class="container is-max-desktop main-content">
    <RouterView ></RouterView>
</div>
<Footer></Footer>
</template>

<style lang = "scss">
@import "bulma/css/bulma.css";
body{
    padding-top: 85px ;
}
</style>
