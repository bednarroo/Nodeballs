<template>
  <nav class="navbar is-transparent is-bordered navbar-border-bottom is-fixed-top">
  <div class="navbar-brand is-full">
    <a class="navbar-item is-full" href="/">
      <img src="../assets/images/notes.png" alt="Notes" class="logo-image"  >
    </a>
    <a role="button" class="navbar-burger is-full " aria-label="menu" aria-expanded="false" 
    @click="isActive =!isActive"
    :class="isActive === false ? '' : 'is-active'"
    >
  <span aria-hidden="true"></span>
  <span aria-hidden="true"></span>
  <span aria-hidden="true"></span>
</a>
  </div>
  
  <div id="navbarExampleTransparentExample" class="navbar-menu ml-5"
  :class="isActive === true ? 'is-active' : ''">
  
    <div class="navbar-start">
      <router-link class="navbar-item" to="/">
        <span class="icon has-text-primary">
          <i class="fa-solid fa-note-sticky fa-xl"></i>
    </span>
    <span class="is-size-5 mx-3">
      Notes
    </span>
      </router-link>
      <router-link class="navbar-item" to="/stats">
        <span class="icon has-text-primary">
          <i class="fa-solid fa-chart-simple fa-xl"></i>
    </span>
    <span class="is-size-5 mx-3">
      Stats
    </span>
  </router-link>
      <router-link class="navbar-item" to="/documentation">
        <span class="icon has-text-primary">
      <i class="fas fa-book fa-xl"></i>
    </span>
    <span class="is-size-5 mx-3">
      Documentation
    </span>
      </router-link>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="field is-grouped">
          <p class="control">
            <button v-if="auth.user.id" class="button is-primary" @click="auth.logoutUser">
              Logout
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</nav>
</template>

<script setup>
import {ref} from "vue";
import { useAuthStore } from "@/stores/auth.js";

const isActive = ref(false);
const auth = useAuthStore();

</script>

<style>
.navbar-border-bottom{
  border-bottom: 2px solid #00d1b2 ; 
}
.is-fixed-top{
  top: 0
}
.navbar{
  padding: 10px;
  height: 90px;
}
.is-full{
  height: 100%!important;
}
.logo-image {
    max-height: 2.75rem!important;
}
</style>