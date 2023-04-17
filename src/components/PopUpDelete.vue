<template  >
  <div class="column card pop-up-container m-5 priority pt-0">
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
    z-index: 2;
    background-color: white;
    width: 80vw;
    border: 1px solid black;
    border-radius: 4%;
    margin: 0 auto 0 auto;
}

</style>



