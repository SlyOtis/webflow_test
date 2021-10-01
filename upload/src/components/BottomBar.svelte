<script lang="ts">
  import type {InputFile, ProgressInfo} from "../lib/utils";
  import ProgressBar from "./ProgressBar.svelte";
  import fileStore from "../lib/stores";
  import {clearEditFile, editFile, setEditFile} from "../lib/associate";
  import Player from "./Player.svelte";
  import compareDesc from "date-fns/compareDesc";
  import IconClose from "../icons/IconClose.svelte";

  export let files: Array<InputFile>
  $: files = Object.keys($fileStore)
    .map(key => $fileStore[key] as InputFile)
    .sort((a, b) => compareDesc(a.createdAt, b.createdAt))


  //TODO:: Do this on add or update ?
  const processFiles = (input: Array<InputFile>) => {
    const info = input.reduce((prev, curr) => {
      const upload = curr?.upload?.progress || 0
      const processing = curr?.processing?.progress || 0


      return {
        uploads: {
          ...prev.uploads,
          total: prev.uploads.total + 1,
          ...upload >= 1 && {
            index: prev.uploads.index + 1
          },
          progress: prev.uploads.progress + upload
        },
        processing: {
          ...prev.processing,
          total: prev.processing.total + 1,
          ...processing >= 1 && {
            index: prev.processing.index + 1
          },
          progress: prev.processing.progress + processing
        },
        associated: {
          ...prev.associated,
          total: prev.associated.total + 1,
          ...curr.refId && {
            index: prev.associated.index + 1
          }
        }
      }
    }, {
      associated: {
        total: 0,
        index: 0,
        progress: 0
      },
      uploads: {
        total: 0,
        index: 0,
        progress: 0
      },
      processing: {
        total: 0,
        index: 0,
        progress: 0
      }
    })

    info.processing.progress = info.processing.progress / info.processing.total
    info.uploads.progress = info.uploads.progress / info.uploads.total
    info.associated.progress = info.associated.index / info.associated.total
    return info
  }

  function onSubmit(e) {
    const refId = e.target.elements.refId.value
    const file = $editFile
    if (refId && refId.length > 2 && file) {
      fileStore.update(state => ({
        ...state,
        [file.id]: {
          ...state[file.id],
          refId
        }
      }))

      const nextFile = files.find(value => value.id !== file.id && !file.refId)
      if (nextFile) {
        setEditFile(nextFile)
      } else {
        clearEditFile()
      }

      return
    }
  }

  $: info = processFiles(files)

</script>

{#if files?.length}
	<div class="root card-background" class:editing={$editFile}>
		{#if $editFile}
			<div class="close" on:click|preventDefault|stopPropagation={clearEditFile}>
				<IconClose />
			</div>
			<Player src={$editFile}/>
			<form
					on:submit|preventDefault|stopPropagation={onSubmit}
			>
				<p>
					Fyll inn ref-iden fra webflow her for å koble sammen player og butikkoppføring.
				</p>
				<div class="input-container">
					<input
							id="refId"
							name="refId"
							type="text"
							autocomplete="off"
							spellcheck="off"
							placeholder=" "
					/>
					<label for="refId">
						RefId
					</label>
				</div>
				<button type="submit">
					Set RefId
				</button>
			</form>
		{:else }
			<ProgressBar title="Uploading" info={info.uploads}/>
			<ProgressBar title="Processing" info={info.processing}/>
			<ProgressBar title="Associated" info={info.associated}/>
		{/if}
	</div>
{/if}

<style>
  :root {
    --background: #212121;
    --selected: #282727;
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
    margin-top: 32px;
    padding: 8px 16px;
    min-width: 20vw;
  }

  .editing {
    flex-direction: row;
    background-color: var(--background);
  }

  form {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    color: white;
    max-width: 250px;
  }

  .input-container {
    position: relative;
    background-color: var(--background);
    width: 100%;
  }

  input {
    position: relative;
    outline: none;
    border-radius: 1em;
    width: 100%;
    height: auto;
    border: 1px solid #3b3b3b;
    background-color: var(--selected);
    transition: 350ms all ease-out;
    padding: 4px 8px;
    color: white;
    font-size: 1em;
    max-width: 250px;
  }

  label {
    position: absolute;
    padding: 0;
    top: 0;
    left: 0;
    margin: 4px 0 0 8px;
    font-size: 1em;
    will-change: font-size, margin, opacity, background-color;
    transition: 250ms all ease-out;
    color: white;
    z-index: 2;
    opacity: 0.65;
    background-color: var(--selected);
  }

  input:focus + label, input:hover + label, input:active + label {
    background-color: var(--background);
    margin: -0.5em 0 0 8px;
    opacity: 1;
    font-size: 0.6em;
  }

  input:not(:placeholder-shown) ~ label {
    background-color: var(--background);
    margin: -0.5em 0 0 8px;
    opacity: 1;
    font-size: 0.6em;
  }

  input:focus, input:hover, input:active {
    border: 1px solid #ababab;
  }

  p {
	  font-size: 0.8em;
  }

  button {
	  position: relative;
	  justify-self: flex-end;
	  align-self: flex-end;
	  margin-top: 8px;
	  border-radius: 1em;
	  background-color: var(--selected);
    border: 1px solid #3b3b3b;
	  color: white;
	  padding: 4px 8px;
	  font-size: 0.8em;
	  text-transform: uppercase;
	  letter-spacing: 1px;
	  transition: 250ms all ease-out;
	  transform-origin: center;
	  outline: none;
    cursor: pointer;
  }

  button:hover, button:focus {
	  border-color: #ababab;
  }

  button:active {
	  transform: scale(0.99);
  }

  .close {
	  position: absolute;
	  top: 0;
	  right: 0;
	  width: 24px;
	  height: 24px;
	  border-radius: 50%;
	  color: white;
	  fill: white;
	  padding: 4px;
	  cursor: pointer;
	  transition: 250ms all ease-out;
	  z-index: 10;
  }

  .close:hover {
	  transform: scale(1.2);
  }

  .close:active {
    transform: scale(0.8);
  }

</style>


