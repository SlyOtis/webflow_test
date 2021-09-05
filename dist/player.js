(function () {
  fetch('https://herro-420.web.app/player.html').then(res => {
    console.log('Fetch success')
    return res.text()
  }).then(content => {
    const parent = document.querySelector(".player")
    if (parent) {
      parent.innerHTML = content
    }
  })
})();
