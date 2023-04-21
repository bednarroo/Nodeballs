<template  >
 <div class="card column m-0 priority pt-0 pop-up-container">
  <div class="card-content py-5 px-3	">
    <p class="is-size-4 has-text-centered has-text-weight-semibold		">
Do you want to delete note with title: {{props.title}} and id: {{ props.id }}   </p>
  </div>

  <footer class="is-flex is-justify-content-center footer"  >
      <button @click="showAllNotes" class="button is-link is-selected w-35"> Show all notes</button>
  <button class="button is-danger is-selected w-35" @click="deleteElement(id)">
    Delete this note
  </button>
  </footer>
</div>
</template>

<script setup>
  import {useNotesStore} from '@/stores/notes.js';
  import {defineEmits} from 'vue';
  const emit = defineEmits(['closePopUp']);

  const notes = useNotesStore();

  const props = defineProps({
    title:{type: String, required: true},
    id:{type: Number, required: true},
})

const deleteElement = (id) => {
  notes.deleteNote(id);
  emit('closePopUp');
}

const showAllNotes = () => {
  emit('closePopUp');
}



</script>

<style>

.pop-up-container{
    position: fixed;
    top: 50vh;
    z-index: 31;
    left: calc(50vw - 175px);
    border: 3px solid black;
    border-radius: 20px;
    width: 350px;
}

.pop-up-container::after{
  position: fixed;
  top: 0;
  left:0;
  background-color: white;
  opacity: 70%;
  content: "";
  width: 100vw;
  height: 100vh;
  z-index: -1;
}

</style>



