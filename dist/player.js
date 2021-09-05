(function () {
  fetch('https://cdn.jsdelivr.net/gh/SlyOtis/webflow_test@1.0.1/dist/index.html').then(res => {
    console.log('Fetch success')
    return res.text()
  }).then(content => {
    const parent = document.querySelector(".player")
    if (parent) {
      parent.append(content)
    }
    console.log(content)
    //append(content)
  })
})();
