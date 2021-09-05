(function() {
  fetch('./index.html').then(res => {
    console.log('Fetch success')
    return res.text()
  }).then(content => {
    console.log(document.querySelector(".player"))
    //append(content)
  })
})()