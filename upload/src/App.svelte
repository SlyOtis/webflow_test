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
  import {fileStore} from "./lib/stores"
  import {Subject} from "rxjs"
  import {mergeWith, buffer} from "rxjs/operators"


  let ready = false
  const audioContext = new AudioContext();

  const processor = new Subject<InputFile>()

  let count = 0

  processor.pipe(
	  mergeWith(generateWave),
  ).subscribe()

  async function generateWave(inn: InputFile) {

    count++
	  console.log("count is " + count)

    const buffer = await inn.file.arrayBuffer()

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

	  return await new Promise((resolve, reject) => {
      WaveformData.createFromAudio(options, (err, waveform) => {
        if (err) {
          reject(err);
        } else {
          resolve(waveform);
        }
      })
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
    processor.next(detail)
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
		<FileUpload on:input={onInput}>
			<FilesList/>
		</FileUpload>
		<UploadInfo/>
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
