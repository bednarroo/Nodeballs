<template>
  <nav class="navbar is-transparent is-bordered navbar-border-bottom is-fixed-top">
  <div class="navbar-brand">
    <a class="navbar-item" href="/">
      <img src="../assets/images/notes.png" alt="Bulma: a modern CSS framework based on Flexbox" >
    </a>
  </div>

  <div id="navbarExampleTransparentExample" class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item" href="https://bulma.io/">
        Notes
      </a>
      <a class="navbar-item" href="https://bulma.io/">
        Stats
      </a>
      <a class="navbar-item" href="https://bulma.io/">
        Docs
      </a>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="field is-grouped">
          <p class="control">
            <a class="button is-primary" href="https://github.com/jgthms/bulma/releases/download/0.9.4/bulma-0.9.4.zip">
              <span>Logout</span>
            </a>
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
</style>