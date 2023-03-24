import {ref, computed} from 'vue';
import {defineStore} from 'pinia'


export const useNotesStore = defineStore("notes", () =>{
    const notes = ref({
name: "XD",
email: "xdsada"
    });

    const website = computed(() =>
notes.value.name.substring()
    )
});