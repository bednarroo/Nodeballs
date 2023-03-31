<template >
  <div class="notification is-primary is-flex is-flex-direction-column ">
    <span class="container">Please fill-up form to add new Note! </span>
  </div>
  <AddElementForm></AddElementForm>
  <div class=" is-flex is-flex-wrap-wrap is-justify-content-space-evenly ">
    <div class="container is-fluid mt-5">
      <div class="notification is-primary is-flex is-flex-direction-column	">
    <span class="container">Too much of notes? Use our search engine to find matching one! </span>
  </div>
      <Search></Search>
  <div class="notification is-primary is-flex is-flex-direction-column	">
    <span class="container">Down below you will find your <strong>fluid</strong> notes. You can either delete or modify them!</span>
  </div>
  <Order></Order>
</div>
  <Card v-for="note in notes.notes" :title="note.title" :description="note.description" :date="note.date" :priority="note.priority" :key="note.id" :id=note.id ></Card>
  </div>
  </template>
  
  <script setup>
  import Card from '@/components/Card.vue';
  import AddElementForm from '@/components/AddElementForm.vue';
  import Search from '@/components/Search.vue';
  import Order from '@/components/Order.vue'
  import {useNotesStore} from '@/stores/notes.js';

  const notes = useNotesStore();

  </script>
  
  <style>
  
  </style>