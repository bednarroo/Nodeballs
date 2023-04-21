import { defineStore } from 'pinia';
import { collection, onSnapshot, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '@/js/firebase';


const notesCollectionRef = collection(db, "notes");

export const useNotesStore = defineStore({
    id: 'notes',
    state: () => ({
        notes: [
            // {title: "something", priority: '2', description: "dsaddsadaa", date: new Date(), id: 5 }, {title: "something2", priority: '2', description: "dsdadadaada", date: new Date(), id: 1 },{title: "something3", priority: '3', description: "dsada",  date: new Date(), id: 2 },{title: "something4", priority: '1', description: "dsadsdadaa",  date: new Date(), id: 3 } 
        ],
        showLoader: true
    }),
    getters: {
        getItemById: (state) => (id) => {
            return state.notes.find((note) => note.id === id)
          },
    },
    actions: {
     async getNotes(){
            onSnapshot(notesCollectionRef, (querySnapshot) => {
                const notes = []
                querySnapshot.forEach((doc) => {
                notes.push({...doc.data(), id: doc.id})
                });
                this.notes = notes;
                this.showLoader = false;
              }); 
              
        },
        async addNote(note) {
            let id = new Date().getTime().toString();
            let data = new Date().toISOString().slice(0, 10);
            await setDoc(doc(db, 'notes', id), {...note, data});
        }
        ,
        async deleteNote(noteid){
            await deleteDoc(doc(db, 'notes', noteid));
        },
        async editNote(editedValues, idToEdit){
            await updateDoc(doc(db, 'notes', idToEdit),{
                title: editedValues.title,
                description: editedValues.description,
                priority: editedValues.priority
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
