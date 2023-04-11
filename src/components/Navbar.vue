<template>
  <nav class="navbar is-transparent is-bordered navbar-border-bottom is-fixed-top">
  <div class="navbar-brand">
    <a class="navbar-item" href="/">
      <img src="../assets/images/notes.png" alt="Bulma: a modern CSS framework based on Flexbox" >
    </a>
    <a role="button" class="navbar-burger " aria-label="menu" aria-expanded="false" 
    @click="isActive =!isActive"
    :class="isActive === false ? '' : 'is-active'"
    >
  <span aria-hidden="true"></span>
  <span aria-hidden="true"></span>
  <span aria-hidden="true"></span>
</a>
  </div>
  
  <div id="navbarExampleTransparentExample" class="navbar-menu"
  :class="isActive === true ? 'is-active' : ''">
  
    <div class="navbar-start">
      <router-link class="navbar-item" to="/">
        <span class="icon has-text-primary">
          <i class="fa-solid fa-note-sticky"></i>
    </span>
    <span>
      Notes
    </span>
      </router-link>
      <router-link class="navbar-item" to="/stats">
        <span class="icon has-text-primary">
          <i class="fa-solid fa-chart-simple"></i>
    </span>
    <span>
      Stats
    </span>
  </router-link>
      <router-link class="navbar-item" to="/docs">
        <span class="icon has-text-primary">
      <i class="fas fa-book"></i>
    </span>
    <span>
      Docs
    </span>
      </router-link>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="field is-grouped">
          <p class="control">
            <router-link class="button is-primary" to="https://github.com/jgthms/bulma/releases/download/0.9.4/bulma-0.9.4.zip">
              <span>Logout</span>
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</nav>
</template>

<script setup>
import {ref} from "vue";

const isActive = ref(false);


</script>

<style>
.navbar-border-bottom{
  border-bottom: 2px solid #00d1b2 ; 
}
.is-fixed-top{
  top: 0
}
.navbar{
  padding: 15px;
}
</style>