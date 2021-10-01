import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyAWkPxsbuKqPROEZ1tmmG2ZlvhpgfZIKT8",
  authDomain: "herro-420.firebaseapp.com",
  projectId: "herro-420",
  storageBucket: "herro-420.appspot.com",
  messagingSenderId: "687309360894",
  databaseURL: "https://herro-420-default-rtdb.europe-west1.firebasedatabase.app/",
  appId: "1:687309360894:web:cb9b6295452580021e1faf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
export const database = getDatabase(app)






