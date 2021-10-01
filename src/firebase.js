const { initializeApp } = require("firebase/app");
const { getStorage, getDownloadURL, ref } = require("firebase/storage");
// const { initializeApp } = require("https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js");
//const { getStorage, getDownloadURL, ref } = require("https://www.gstatic.com/firebasejs/9.0.1/firebase-storage.js");

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
const storage = getStorage(firebaseApp);

const getAudioFile = (id, parent) => getDownloadURL(ref(storage, `${id}.wav`))
    .then((url) => {
      // Or inserted into an <img> element;
      console.log(`Sat url ${url}`)
      parent.innerHTML = `
        <audio id="player-audio" autoplay loop controls>
          <source type="audio/wav" src="${url}"/>
        </audio>
      `
    })
    .catch((error) => {
      console.error(error)
    })

export {getAudioFile}


