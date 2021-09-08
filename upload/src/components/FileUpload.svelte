<script lang="ts">
  import IconAudio from "../icons/IconAudio.svelte";
  import {createEventDispatcher} from "svelte";
  import {InputFile} from "../lib/utils";
  import {v4 as uuid} from 'uuid'
  import IconBreasts from "../icons/IconBreasts.svelte";
  import IconDownRight from "../icons/IconDownRight.svelte";
  import {fly} from "svelte/transition";

  const dispatch = createEventDispatcher()

  let input: HTMLInputElement
  export let files: Array<InputFile> = []

  function onInput(e) {
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files.item(i) as File

      if (!file.type.startsWith('audio')) {
        continue
      }

      const inputFile = {
        id: uuid().toString(),
        name: "",
        file
      }

      files.push(inputFile)

      files = files

      dispatch('input', inputFile)
    }

    input.value = null
    input.files = null

    files = files
  }

</script>

<form>
	<div class="root">
		<div class="inner">
			{#if files.length <= 0}
				<div class="empty">
					<span class="empty-text">Click the tits to upload songs.</span>
					<span class="icon">
					<IconDownRight/>
				</span>
				</div>
			{:else}
				<div class="files">
					{#each files as file}
						<div class="file" transition:fly>
							<IconAudio/>
							<span>{file.name}</span>
						</div>
					{/each}
				</div>
			{/if}
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

  input {
    display: none;
  }

  .root {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    background-color: #E0E0E0;
    border-radius: 8px;
    border: 1px solid #BDBDBD;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: 350ms all ease-out;
  }

  .inner {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: 350ms all ease-out;
    border-radius: 8px;
  }

  .files {
    position: relative;
    display: grid;
    width: 100%;
    height: auto;
    min-height: min(20vh, 20vw);
    grid-template-columns: repeat(4, minmax(100px, 1fr));
    grid-auto-rows: minmax(100px, 1fr);
    grid-gap: 8px;
    padding: 16px;
    overflow-x: hidden;
    overflow-y: auto;
    border: none;
    transition: 350ms all ease-out;
  }

  .file {
    position: relative;
    width: 100%;
    height: 100%;
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
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    z-index: 2;
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
    z-index: 10;
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

  .empty {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 100%;
    max-width: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: none;
    user-select: none;
    color: #BDBDBD;
    padding: 16px;
  }

  .empty-text {
    position: relative;
    width: 100%;
    text-align: center;
    font-size: 1.2em;
  }

  .icon {
    width: 10vh;
    height: 10vh;
  }
</style>