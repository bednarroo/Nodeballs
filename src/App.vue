<script setup>
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
<Navbar></Navbar>
<RouterView></RouterView>
<Footer></Footer>
</template>

<style lang = "scss">
@import "bulma/css/bulma.css";
body{
    padding-top: 55px ;
}
</style>
