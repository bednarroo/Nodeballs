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
            this.notes.push(note);
            console.log(note)
        },
        deleteNote(noteid){
            this.notes = this.notes.filter(note => {
                return note.id !== noteid });

        },
        editNote(editedValues, idToEdit){
            this.notes = this.notes.map( note => {
                if (note.id === idToEdit){
                    console.log(note.id, idToEdit)
                    return editedValues;
                }else{
                    return note
                }
        })
    },  
    sortNote(methodOfOrder){
        if(methodOfOrder === "title"){
          return this.notes.sort((a, b) => a.title.localeCompare(b.title));
        }else if(methodOfOrder === "priority"){
           return this.notes.sort((a,b) => a.priority - b.priority);
        }else{
           return this.notes.sort((a, b) => a.date - b.date);
        }
    },
}
});
