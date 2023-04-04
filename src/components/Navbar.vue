<template>
  <nav class="navbar is-transparent is-bordered navbar-border-bottom is-fixed-top">
  <div class="navbar-brand">
    <a class="navbar-item" href="/">
      <img src="../assets/images/notes.png" alt="Bulma: a modern CSS framework based on Flexbox" >
    </a>
  </div>

  <div id="navbarExampleTransparentExample" class="navbar-menu">
    <div class="navbar-start">
      <router-link class="navbar-item" to="/">
        Notes
      </router-link>
      <router-link class="navbar-item" to="/stats">
        Stats
      </router-link>
      <router-link class="navbar-item" to="/docs">
        Docs
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

<script>
export default {

}
</script>

<style>
.navbar-border-bottom{
  border-bottom: 2px solid #00d1b2 ; 
}
.is-fixed-top{
  top: 0
}
</style>