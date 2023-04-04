import { defineStore } from 'pinia'

export const useNotesStore = defineStore({
    id: 'notes',
    state: () => ({
        notes: [{title: "something", priority: '2', description: "dsaddsadaa", date: new Date(), id: 5 }, {title: "something2", priority: '2', description: "dsdadadaada", date: new Date(), id: 1 },{title: "something3", priority: '3', description: "dsada",  date: new Date(), id: 2 },{title: "something4", priority: '1', description: "dsadsdadaa",  date: new Date(), id: 3 } ]
    }),
    getters: {
        getItemById: (state) => (id) => {
            return state.notes.find((note) => note.id === id)
          },
    },
    actions: {
        addNote(note){
            this.notes.push(note)
        },
        deleteNote(noteid){
            this.notes = this.notes.filter(note => {
                return note.id !== noteid });

        },
        editNote(editedValues, idToEdit){
            this.notes = this.notes.map( note => {
                if (note.id === parseInt(idToEdit, 10)){
                    return editedValues;
                }else note
        })
    }
}})