import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCIiA8o_q8PQ_S7_vkf2tVJ4m2sN3fO1o",
  authDomain: "nodebaals.firebaseapp.com",
  projectId: "nodebaals",
  storageBucket: "nodebaals.appspot.com",
  messagingSenderId: "829176477684",
  appId: "1:829176477684:web:3f31bdf655061abb59aba1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export{
    db
}
