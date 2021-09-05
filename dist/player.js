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
    console.log(getRef())
    const parent = document.querySelector('.player')
    if (parent) {
      parent.innerHTML = content
    }
  })
})();
