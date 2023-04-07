<template  >
  <div class="card card column is-one-third m-5 priority" :class="priorityClass">
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
  <div class="card-footer">
    <router-link to="">
        <div class="card-footer-item">
        <router-link :to = "`/edit/${props.id}`">
            <span>Edit {{props.id}}</span>
        </router-link>
    </div>
    </router-link>
    <p class="card-footer-item">
      <button @click="deleteElement(id)">  Delete
      </button>
    </p>
    {{ props.priority }}
    
</div>
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

</style>