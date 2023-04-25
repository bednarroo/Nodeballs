import { defineStore } from 'pinia';
import { collection, onSnapshot, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '@/js/firebase';
import {useAuthStore} from "@/stores/auth.js"



let notesCollectionRef;
let getOnSnapshot;


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
    actions:
    {
    init(){
        const auth = useAuthStore();
        const userid = auth.user.id;
        console.log(userid)
        notesCollectionRef = collection(db, "users", userid, "notes");
        this.getNotes()

    },
     async getNotes(){
        getOnSnapshot = onSnapshot(notesCollectionRef, (querySnapshot) => {
                const notes = []
                querySnapshot.forEach((doc) => {
                notes.push({...doc.data(), id: doc.id})
                });
                this.notes = notes;
                this.showLoader = false;
              }); 
              
        },
    cleanNotes(){
        this.notes = []
       if(getOnSnapshot) getOnSnapshot();
    },
        async addNote(note) {
            let id = new Date().getTime().toString();
            let date = new Date().toISOString().slice(0, 10);
            await setDoc(doc(notesCollectionRef, id), {...note, date});
        }
        ,
        async deleteNote(noteid){
            await deleteDoc(doc(notesCollectionRef, noteid));
        },
        async editNote(editedValues, idToEdit){
            await updateDoc(doc(notesCollectionRef, idToEdit),{
                title: editedValues.title,
                description: editedValues.description,
                priority: editedValues.priority
            })
    },  
    sortNote(methodOfOrder){
        if(methodOfOrder === "title"){
          return this.notes.sort((a, b) => a.title.localeCompare(b.title));
        }else if(methodOfOrder === "priority"){
           return this.notes.sort((a,b) => b.priority - a.priority);
        }else{
           return this.notes.sort((a, b) => a.date - b.date);
        }
    },
}
});
