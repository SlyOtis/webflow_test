<script lang="ts">
  import {InputFile} from "../lib/utils";
  import IconDownRight from "../icons/IconDownRight.svelte";
  import {beforeUpdate} from "svelte";
  import {fly} from "svelte/transition";
  import Waveform from "./Waveform.svelte";
  import IconAudio from "../icons/IconAudio.svelte";
  import fileStore from "../lib/stores";

  export let files: Array<InputFile> = []
  $: files = Object.keys($fileStore).map(key => $fileStore[key])

  let gridTemplateColumns = 'unset'

  function calculateColumns() {
    const columnCount = Math.max(1, Math.min(files.length, Math.floor((window.innerWidth * 0.8) / 100) - 1))
    gridTemplateColumns = `repeat(${columnCount}, 100px)`
  }

  beforeUpdate(() => {
    calculateColumns()
  })
</script>

<svelte:window on:resize={calculateColumns} />


{#if files.length <= 0}
	<div class="empty">
		<span class="empty-text">Flick the tits to upload songs.</span>
		<span class="icon">
			<IconDownRight/>
		</span>
	</div>
{:else}
	<div class="files" style="grid-template-columns: {gridTemplateColumns};">
		{#each files as file}
			<div class="file" transition:fly>
				{#if file.data}
					<Waveform data={file.data}/>
				{:else}
					<IconAudio/>
				{/if}
				<span>{file.name}</span>
			</div>
		{/each}
	</div>
{/if}

<style>

  .files {
    position: relative;
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: repeat(1, 100px);
    grid-auto-rows: 100px;
    place-items: start stretch;
    gap: 8px;
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
    user-select: none;

  }

  .file:hover {
    cursor: pointer;
    transform: translateY(-1vh);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    z-index: 2;
  }

  .empty {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: none;
    user-select: none;
    color: #BDBDBD;
    padding: 16px;
    transition: 250ms all ease-out;
  }

  .empty-text {
    position: relative;
    width: 100%;
    height: auto;
    text-align: center;
    font-size: 1.2em;
  }

  .icon {
    width: 10vh;
    height: 10vh;
  }
</style>