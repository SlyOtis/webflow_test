<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {InputFile} from "../lib/utils";
  import {v4 as uuid} from 'uuid'
  import IconBreasts from "../icons/IconBreasts.svelte";

  const dispatch = createEventDispatcher()

  let input: HTMLInputElement
  export let files: Array<InputFile> = []
  let invalidFile = false, dragOver = false

  function updateFiles(file: File): boolean {

    if (!file.type.startsWith('audio')) {
      return false
    }

    const inputFile = {
      id: uuid().toString(),
      name: file.name,
      file
    }

    files.push(inputFile)
    files = files
    dispatch('input', inputFile)
  }

  function onInput(e) {
    for (let i = 0; i < input.files.length; i++) {
      updateFiles(input.files.item(i))
    }

    input.value = null
    input.files = null

    files = files
  }

  function eachTransferFile(e, callback?: (file: File) => void): Array<File> {
    const files = e.dataTransfer.files; // Array of all files

    let _invalidFiles = !files?.length, _files = []
    for (let i = 0, file; file = files[i]; i++) {
      if (file.type.match(/audio.*/)) {
        if (callback) {
          callback(file)
        }
        _files.push(file)
        continue
      }
      _invalidFiles = true
    }

    invalidFile = _invalidFiles

    return _files
  }

  function onDragOver(e): boolean {
    e.preventDefault()
    e.stopPropagation()

    e.dataTransfer.effectAllowed = 'all'
    e.dataTransfer.dropEffect = 'copy'

    eachTransferFile(e)

    return !invalidFile
  }

  function onDrop(e) {
    e.preventDefault()
    e.stopPropagation()

    dragCancel()

    if (eachTransferFile(e, file => {
      updateFiles(file)
    }).length <= 0) {
      return false
    }

    input.value = null
    input.files = null

    files = files
	  return true
  }

  function dragCancel() {
    invalidFile = false
    dragOver = false

    console.log('cancel')
  }


</script>

<form>
	<div class="root card-background"
	     on:dragenter={() => dragOver = true}
	>
		<div class="overlay" class:display={dragOver}
		     on:dragleave={dragCancel}
		     on:dragover={onDragOver}
		     on:drop={onDrop}
		     on:dragleave={dragCancel}
		>
			<p class:display={invalidFile}>NO!</p>
		</div>
		<div class="inner" class:invalid-file={invalidFile}>
			<slot {files}/>
		</div>
		<button on:click|preventDefault|stopPropagation={ () => input.click()}>
			<IconBreasts/>
			<!--			<span>Upload Songs</span>-->
		</button>
	</div>
	<input
			type="file"
			on:change={onInput}
			bind:this={input}
			multiple
	/>
</form>

<style>

  form {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 1;
  }


  .root {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    border-radius: 8px;
    transition: 350ms all ease-out;
  }


  .inner {
    position: relative;
    text-align: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: 350ms all ease-out;
    border-radius: 8px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .overlay {
    position: absolute;
    z-index: 99;
    background: #546E7A;
    display: none;
    border: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 8px;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    transition: 250ms all ease-out;
	  user-select: none;
  }

  .overlay > * {
	  pointer-events: none;
	  user-select: none;
  }

  .display {
    display: flex;
  }

  .invalid-file {
    filter: blur(25px);
    display: block;
  }

  input {
    display: none;
  }

  button {
    position: absolute;
    outline: none;
    background: #607D8B;
    transition: 350ms all ease-out;
    cursor: pointer;
    user-select: none;
    border: 1px solid #546E7A;
    color: white;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    bottom: 0;
    right: 0;
    margin-right: -32px;
    margin-bottom: -32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    font-family: 'PT Sans Narrow', sans-serif;
    display: flex;
    padding: 8px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 100;
  }

  button > span {
    font-size: 0.2em;
    position: absolute;
    color: white;
    transform: translateY(-100%);
  }

  button:hover {
    transform: scale(1.02);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }

  button:active {
    transform: scale(0.99);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.12), 0 0 2px rgba(0, 0, 0, 0.24);
  }
</style>