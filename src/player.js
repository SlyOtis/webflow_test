const {getAudioFile} = require("./firebase");

(function () {

  function getRef() {
    return document.querySelector(".player")
        .parentElement.querySelector('#ref-value').innerHTML
  }

  fetch('https://herro-420.web.app/player.html', {
    mode: 'no-cors',
    method: 'get'
  }).then(res => {
    console.log('Fetch success')
    return res.text()
  }).then(content => {
    const ref = getRef()
    console.log(ref)

    const parent = document.querySelector('.player')
    if (parent) {
      parent.innerHTML = content
    }

    getAudioFile(ref)

  })
})();
