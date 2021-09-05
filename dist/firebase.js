import { initializeApp } from "firebase/app";
import { getStorage, getDownloadURL, ref } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyAWkPxsbuKqPROEZ1tmmG2ZlvhpgfZIKT8",

  authDomain: "herro-420.firebaseapp.com",

  projectId: "herro-420",

  storageBucket: "herro-420.appspot.com",

  messagingSenderId: "687309360894",

  appId: "1:687309360894:web:bde955345fff37451e1faf"

};


const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
export const storage = getStorage(firebaseApp);

export const getAudioFile = (id) => getDownloadURL(ref(storage, `${id}.wav`))
    .then((url) => {
      // `url` is the download URL for 'images/stars.jpg'

      // This can be downloaded directly:
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();

      // Or inserted into an <img> element
      const audio = document.getElementById('player-audio');
      audio.setAttribute('src', url);

      console.info(`Sat url ${url}`)
    })
    .catch((error) => {
      // Handle any errors
      console.error(error)
    });



