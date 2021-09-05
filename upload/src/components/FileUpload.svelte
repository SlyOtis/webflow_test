<script lang="ts">
  import IconAudio from "../icons/IconAudio.svelte";
  import {createEventDispatcher} from "svelte";
  import {InputFile} from "../lib/utils";
  import {v4 as uuid} from 'uuid'

  const dispatch = createEventDispatcher()

  let input: HTMLInputElement
  export let files: Array<InputFile> = []

  function onInput(e) {
    const file = input.value as File

    files.push({
      id: uuid().toString(),
      name: "",
      file
    })

    input.value = null
    files = files

    dispatch('input', file)
  }

</script>

<form>
  <div class="root">
    <div class="files">
      {#each files as file}
        <div class="file">
          <IconAudio/>
          <span>
            {file.name}
          </span>
        </div>
      {/each}
    </div>

    <button class="upload-btn" on:click|preventDefault|stopPropagation={ () => input.click()}>
      Upload Songs
    </button>
  </div>

  <input type="file" on:input={onInput} bind:this={input}/>
  <button>
  </button>
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
  }

  input {
    display: none;
  }

  .root {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    display: flex;
    max-width: 864px;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    background-color: #c2c2c2;
    border-radius: 8px;
    border: none;
    overflow: hidden;
  }

  .files {
    position: relative;
    display: grid;
    width: 100%;
    height: auto;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 1fr;
    grid-gap: 8px;
    padding: 16px;
    border: none;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .file {
    position: relative;
    width: 100%;
    height: 100%;
    max-height: 20vh;
    min-height: 20vh;
    border-radius: 8px;
    background-color: white;
    transition: 350ms all ease-out;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .file:not(:last-of-type) {
    margin-right: 8px;
  }

  .file:hover {
    cursor: pointer;
    transform: translateY(-1vh);
  }

  .upload-btn {
    position: revert;
    outline: none;
    border: none;
    border-radius: 4px;
    background: none;
    color: #363636;
    transition: 350ms all ease-out;
    cursor: pointer;
    height: 32px;
  }

  .upload-btn:hover {
    background: #c2c2c2;
    transform: scale(1.1);
  }

  .upload-btn:active {
    background: #c2c2c2;
    transform: scale(0.8);
  }
</style>