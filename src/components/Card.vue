<template  >
  <div class="card card column is-one-third m-5">
  <div class="card-content">
    <p class="title">
{{props.name}}    </p>
    <p class="subtitle">
      {{ props.date }}
    </p>
  </div>
  <div class="card-footer">
    <a href="">
        <div class="card-footer-item">
        <a href="">
            <span>Edit</span>
        </a>
    </div>
    </a>
    <p class="card-footer-item">
      <span> <a href="#">Delete</a>
      </span>
    </p>
</div>
</div>
</template>

<script setup>

const props = defineProps({
    name:{type: String},
    date:{type: String},
    id:{type: String},
})

</script>

<style>

</style>