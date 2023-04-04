<template>
  <div class="card">
  <div class="card-content">
    <div class="content">
      <p>You're edditing element with id: <span class="title pl-3	">  {{ route.params.id }} </span> </p>
      <p>and old title:  <span class="title pl-3	">{{oldTitle}} </span> </p>
    </div>
  </div>
</div>
  <EditElementForm :id = "route.params.id"></EditElementForm>
  </template>
  
  <script setup>
 import { useRoute } from 'vue-router';
 import EditElementForm from '@/components/EditElementForm.vue';
 import {useNotesStore} from '@/stores/notes.js';
 import {ref} from "vue";

//  Load Pinia storage

  const notes = useNotesStore();

  // Get id param from router
  const route = useRoute();
  const routeParam = ref(route.params.id)

  // Use getter to get old title
  const oldTitle =  notes.getItemById(Number(routeParam.value)).title;

  


  </script>
  
  <style>
  
  </style>