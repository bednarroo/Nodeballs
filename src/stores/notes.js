import { defineStore } from 'pinia'

export const useNotesStore = defineStore({
    id: 'notes',
    state: () => ({
        notes: [{title: "something", priority: '2', description: "dsaddsadaa", date: new Date(), id: 5 }, {title: "something2", priority: '2', description: "dsdadadaada", date: new Date(), id: 1 },{title: "something3", priority: '3', description: "dsada",  date: new Date(), id: 2 },{title: "something4", priority: '1', description: "dsadsdadaa",  date: new Date(), id: 3 } ]
    }),
    actions: {
        addNote(note){
            this.notes.push(note)
        },
        deleteNote(noteid){
            // console.log(this.notes)
            // console.log(noteid);
            this.notes = this.notes.filter(note => {
                console.log(noteid, noteid )
                return note.id !== noteid });

        },
        editNote(){

        }

    }
}
)