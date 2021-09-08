<script lang="ts">
  import FileUpload from "./components/FileUpload.svelte";
  import type {InputFile} from "./lib/utils";
  import WaveformData from 'waveform-data/dist/waveform-data'
  import Background from "./components/Background.svelte";
  import LogoHerro from "./components/LogoHerro.svelte";
  import {fly} from "svelte/transition";
  import {onMount} from "svelte";

  let files: Array<InputFile>
  let ready = false

  const audioContext = new AudioContext();

  function generateWave(inn: InputFile) {
    inn.file.arrayBuffer().then(buffer => {

      const options = {
        audio_context: audioContext,
        array_buffer: buffer,
        scale: 128,
      };

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
      console.log(res)
      console.log(JSON.stringify(res))
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
				bind:files={files}
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
    max-width: max(60vh, 60vw);
    max-height: min(60vh, 60vw);
    min-height: max(20vh, 20vw);
    min-width: max(20vh, 20vw);
  }
</style>
