(function() {
  fetch('./index.html').then(res => {
    console.log('Fetch success')
    return res.text()
  }).then(content => {
    document.querySelector(".player").append(content)
  })
})()