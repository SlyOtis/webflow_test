<script lang="ts">
  import {InputFile} from "../lib/utils";
  import IconDownRight from "../icons/IconDownRight.svelte";
  import {beforeUpdate} from "svelte";
  import {fly, fade} from "svelte/transition";
  import Waveform from "./Waveform.svelte";
  import IconAudio from "../icons/IconAudio.svelte";
  import fileStore from "../lib/stores";
  import IconInfo from "../icons/IconInfo.svelte";
  import {setEditFile} from "../lib/associate";
  import compareDesc from "date-fns/compareDesc";
  import fileStore from "../lib/stores";

  export let files: Array<InputFile> = []
  $: files = Object.keys($fileStore)
	  .map(key => $fileStore[key] as InputFile)
    .sort((a, b) => compareDesc(a.createdAt, b.createdAt))
    .sort((a, b) => (a.refId && b.refId) ? 0 : (!a.refId && b.refId) ? -1 : 1)

  let gridTemplateColumns = 'unset'

  function calculateColumns() {
    const columnCount = Math.max(1, Math.min(files.length, Math.floor((window.innerWidth * 0.8) / 100) - 1))
    gridTemplateColumns = `repeat(${columnCount}, 100px)`
  }

  beforeUpdate(() => {
    calculateColumns()
  })

  function onWaveformReady(svgEl: SVGElement, file: InputFile) {
	  fileStore.update(state => ({
		  ...state,
		  [file.id]: {
		    ...state[file.id],
		    svgEl
		  }
	  }))
  }

</script>

<svelte:window on:resize={calculateColumns}/>


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
					<Waveform data={file.data} on:ready={e => onWaveformReady(e.detail, file)}/>
				{:else}
					<IconAudio/>
				{/if}
				{#if !file.refId}
					<div
							class="associate"
							on:click|preventDefault|stopPropagation={() => setEditFile(file)}
							transition:fade
					>
						<div class="associate-icon">
							<IconInfo/>
						</div>
					</div>
				{/if}
				<span>{file.name}</span>
			</div>
		{/each}
	</div>
{/if}

<style>

	:root {
    --icon-size: 16px
  }

	.associate {
		position: absolute;
		z-index: 10;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		border: 2px solid #d03939;
		border-radius: 8px;
	}

	.associate-icon {
    position: absolute;
		top: calc(var(--icon-size) / -2);
		right: calc(var(--icon-size) / -2);
		width: var(--icon-size);
		height: var(--icon-size);
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		background-color: #d03939;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		fill: white;
		color: white;
		padding: 2px;
	}

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