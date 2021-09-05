(function () {
  fetch('https://cdn.jsdelivr.net/gh/SlyOtis@1.0.4/webflow_test/dist/index.html').then(res => {
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
