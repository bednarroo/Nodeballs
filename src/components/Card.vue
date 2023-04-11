<template  >
  <div class="card column m-5 priority" :class="priorityClass">
  <div class="card-content">
    <p class="title">
{{props.title}}    </p>
    <p class="subtitle">
      {{ props.description }}
    </p>
    <p class="subtitle">
      {{ noteData  }}
    </p>
  </div>

  <footer class="is-flex is-justify-content-center footer"  >
    <router-link :to = "`/edit/${props.id}`">
      <button class="button is-info is-selected w-35">Edit this note</button>
    </router-link>
  <button class="button is-danger is-selected w-35" @click="deleteElement(id)">
    Delete this note
  </button>
  </footer>

</div>
</template>

<script setup>
  import {useNotesStore} from '@/stores/notes.js';
  import moment from 'moment';
  import {computed} from 'vue'

const notes = useNotesStore();

const props = defineProps({
    title:{type: String},
    description: {type: String},
    date:{type: Date},
    id:{type: Number},
    priority:{type: Number},
})

const deleteElement = (id) => {
notes.deleteNote(id)
}
// Computed data. Use correct format with extternal library
const noteData = computed(()=>moment(props.date).format('MMMM d,YYYY'));
const priorityClass = computed(() => {
  console.log(props.priority)
  if (props.priority == 1) {
    return "high-priority";
  } else if (props.priority == 2) {
    return "medium-priority";
  } else {
    return "low-priority";
  }
});


</script>

<style>
.card{
  min-width: 400px
}

.priority{
  border-radius: 20px;
}

.high-priority{
  border: 3px solid red;
}
.medium-priority{
  border: 3px solid blue;
}
.low-priority{
  border: 3px solid green;
  
}

.footer{
  padding: 0
}
.footer > * {
    margin: 0 10px;
}


</style>