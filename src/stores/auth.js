import { defineStore } from 'pinia';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import {auth} from "@/js/firebase"


export const useAuthStore = defineStore("auth",{
    state: () => ({
        user:{

        }
    }),
    actions: {
        init(){
            onAuthStateChanged(auth, (user)=>{
                if(user){
                    this.user.id = user.uid;
                    this.user.email = user.email;
                    this.router.push('/')
                }else{
                    this.user = {};
                    this.router.replace('/login')
                }
            })
        },
        registerUser(credentials){
            createUserWithEmailAndPassword(auth, credentials.email, credentials.password).then((userCredential) => {
            const user = userCredential.user;
            }).catch((error) => {
            console.log("something went wrong with register")
            });
        },
        logoutUser() {
            signOut(auth).then(() => {
                console.log("user signed out")
              }).catch((error) => {
                console.log("there is a problem with sign out")
              });
        },
        loginUser(credentials) {
            signInWithEmailAndPassword(auth, credentials.email, credentials.password).then((userCredential) => {
                     const user = userCredential.user;
                     console.log("loginUSer")
                    }).catch((error) => {
                    console.log("there is a problem with log in")
  });
        }
}
});
