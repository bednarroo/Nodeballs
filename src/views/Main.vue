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
      <Search @updateSearchValue="updateSearch" ></Search>
      <div v-if="noteArray.length">
        <div  class="notification is-primary is-flex is-flex-direction-column	">
    <span  class="container">Down below you will find your <strong>fluid</strong> notes. You can either delete or modify them!</span>
  </div>
  <Order></Order>
      </div>

  <div v-else class="notification is-primary is-flex is-flex-direction-column	">
    <span  class="container">The is no note added yet! Please do it!</span>
  </div>


  </div>
  <template  v-if="notes.showLoader">

    <progress  class="progress is-large is-primary m-5"></progress>
  </template>



<template v-if="!notes.showLoader" >
  <Card
  v-for="note in noteArray" :title="note.title" :description="note.description" :date="note.date" :priority="note.priority" :key="note.id" :id=note.id
  @showPopUp="showPopUp"
  ></Card>
</template>

  </div>
  <Teleport to="body">
  <PopUpDelete 
    :title="popUpValues.title"
    :id="popUpValues.id"
    @closePopUp="closePopUp"
    v-if="isPopUpOpened">
  </PopUpDelete>
</Teleport>
  </template>
  
  <script setup>
  import {ref, computed, reactive} from 'vue'
  
  import Card from '@/components/Card.vue';
  import AddElementForm from '@/components/AddElementForm.vue';
  import PopUpDelete from '@/components/PopUpDelete.vue';
  import Search from '@/components/Search.vue';
  import Order from '@/components/Order.vue'
  import {useNotesStore} from '@/stores/notes.js';




  const notes = useNotesStore();
  const isPopUpOpened = ref(false);
  const popUpValues = reactive({
    title: "",
    id:""
  })
  const searchValue = ref("");
  const noteArray = computed(() => {
      if (searchValue.value === "") {
        return notes.notes;
      } else {
        return notes.notes.filter(note => note.title.includes(searchValue.value));
      }
    });

  const updateSearch = (value) => {
    searchValue.value = value;
  };
  
 const showPopUp = (params) =>{
  isPopUpOpened.value = true;
  popUpValues.id = params[0].id
  popUpValues.title = params[0].title
 }

 const closePopUp = () => {
  isPopUpOpened.value = false
 }

  </script>
  
  <style>
  
  </style>