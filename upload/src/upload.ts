import Upload from './Upload.svelte'
import './main.css'
import './normalize.css'

const app = new Upload({
  target: document.querySelector('body')
})

export default app
