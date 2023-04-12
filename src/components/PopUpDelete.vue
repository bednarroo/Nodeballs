<template  >
  <div class="card is-relative column m-5 priority pt-0">
  <div class="card-content py-5 px-3	">
    <p class="is-size-4 has-text-centered has-text-weight-semibold		">
Do you want to delete note with title:{{props.title}} and id: {{ props.id }}   </p>
  </div>

  <footer class="is-flex is-justify-content-center footer"  >
      <button @click="showAllNotes" class="button is-link is-selected w-35">Show all notes</button>
  <button class="button is-danger is-selected w-35" @click="deleteElement(id)">
    Delete this note
  </button>
  </footer>

</div>
</template>

<script setup>
  import {useNotesStore} from '@/stores/notes.js';
  import { useRouter } from 'vue-router';

const router = useRouter()

const notes = useNotesStore();

const props = defineProps({
    title:{type: String},
    id:{type: Number},
})

const deleteElement = (id) => {
notes.deleteNote(id);
this.$emit('closePopUp');
router.push({path: "/"});
}

const showAllNotes = () => {
  this.$emit('closePopUp');
}

defineEmits("closePopUp")



</script>

<style>

</style>



