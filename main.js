document.addEventListener('ready', () => {
  console.log('TEST SUCCESS')

  fetch('./index.html').then(res => {
    console.log('Fetch success')
    return res.text()
  }).then(content => {
    document.getElementById("body").append(content)
  })
})