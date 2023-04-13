<template >
    <div class="field is-grouped">
  <p class="control is-expanded">
    <input class="input" type="text"
     v-model="searchValue"
     placeholder="Find your notes by title">
  </p>
  <button class="control" 
    @click="searchValue = ''" >
    <span class="button is-info" >
      Clean 
    </span>
  </button>
</div>
    </template>
    
    <script setup>

 // imports
import {ref, watch, defineEmits} from 'vue';

const searchValue = ref("");

const emit = defineEmits(['updateSearchValue'])

watch(searchValue, ()=> {
  emit('updateSearchValue', searchValue.value);
});
    </script>
    
    <style>
    
    </style>