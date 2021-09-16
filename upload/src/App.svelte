<script lang="ts">
  import FileUpload from "./components/FileUpload.svelte";
  import type {InputFile} from "./lib/utils";
  import WaveformData from 'waveform-data/dist/waveform-data'
  import Background from "./components/Background.svelte";
  import LogoHerro from "./components/LogoHerro.svelte";
  import {fly} from "svelte/transition";
  import {onMount} from "svelte";
  import UploadInfo from "./components/UploadInfo.svelte";
  import FilesList from "./components/FilesList.svelte";
  import {fileStore} from "lib/stores"

  let ready = false
  const audioContext = new AudioContext();

  function generateWave(inn: InputFile) {
    inn.file.arrayBuffer().then(buffer => {

      const options = {
        audio_context: audioContext,
        array_buffer: buffer,
        scale: 128,
      };

      fileStore.update(state => ({
        ...state,
        [inn.id]: {
          ...inn,
          processing: {
            progress: 0.5
          }
        }
      }))

      return new Promise((resolve, reject) => {
        WaveformData.createFromAudio(options, (err, waveform) => {
          if (err) {
            reject(err);
          } else {
            resolve(waveform);
          }
        });
      });
    }).then((res: WaveformData) => {
      fileStore.update(state => ({
        ...state,
        [inn.id]: {
          ...inn,
	        data: res as any,
          processing: {
            progress: 1
          }
        }
      }))
    })
  }

  function onInput({detail}: { detail: InputFile }) {
    generateWave(detail)
  }

  onMount(() => {
    ready = false
    fetch('https://fonts.googleapis.com/css2?family=PT+Sans+Narrow&display=swap')
      .then(res => {
        ready = true
      })
  })

</script>

<LogoHerro/>
<Background/>

{#if ready}
	<main transition:fly={{delay: 350, y: 200, opacity: 0}}>
		<FileUpload
				on:input={onInput}
				bind:files
		>
			<FilesList bind:files/>
		</FileUpload>
		<UploadInfo
				bind:files
		/>
	</main>
{/if}

<style>
  main {
    position: relative;
    width: auto;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 1;
	  max-width: 80vw;
	  max-height: 80vh;
	  min-width: 132px;
	  min-height: 132px;
  }
</style>
