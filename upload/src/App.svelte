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
	import {storage} from "./lib/firebase";
  import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"


	let ready = false
  const audioContext = new AudioContext();

	const toProcess: Array<InputFile> = []
	const toUpload: Array<InputFile> = []

  let count = 0
	let isProcessing = false

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

  async function uploadFile(inn: InputFile) {
		// Create a reference to 'mountains.jpg'
		await new Promise((resolve, reject) => {

			const names = inn.file.name.split(".")
			const ext = names[names.length - 1]
			const fileRef = ref(storage, inn.id + "/" + "audio." + ext);

			const uploadTask = uploadBytesResumable(fileRef, inn.file);

		// Listen for state changes, errors, and completion of the upload.
			uploadTask.on('state_changed',
					(snapshot) => {
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						const progress = (snapshot.bytesTransferred / snapshot.totalBytes);

						fileStore.update(state => ({
							...state,
							[inn.id]: {
								...state[inn.id],
								upload: {
									...inn.upload,
									progress
								}
							}
						}))
					},
					reject,
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							inn.audioUrl = downloadURL

							fileStore.update(state => ({
								...state,
								[inn.id]: {
									...inn,
									...state[inn.id]
								}
							}))

							resolve(inn)

						}).catch(reject);
					}
			);
		})


	}

  function onInput({detail}: { detail: InputFile }) {
		toProcess.push(detail)

		uploadFile(detail)

		if (isProcessing) return
		const first = toProcess.shift()
		if (!first) return
		isProcessing = true
		processFileInput(first)
  }

  async function processFileInput(inn: InputFile) {
		await generateWave(inn)
		toUpload.push(inn)

		await new Promise(resolve => setTimeout(() => resolve(), 200))
		const next = toProcess.shift()
		if (next) {
			return await processFileInput(next)
		} else {
			isProcessing = false
		}
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
