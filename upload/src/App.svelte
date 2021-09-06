<script lang="ts">
  import FileUpload from "./components/FileUpload.svelte";
  import type {InputFile} from "./lib/utils";
  import WaveformData from 'waveform-data'

  let files: Array<InputFile>

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
    }).then(res => {
      console.log(res)
    })
  }

  function onInput(e) {
    console.log(e.detail)
  }

</script>

<main>
  <FileUpload
      on:input={onInput}
      bind:files={files}
  />
</main>

<style>
  main {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 16px 32px;
    background: url("https://uploads-ssl.webflow.com/5fc59358e61c89d18bd0968f/60ae6f3c22d33caef11cdd10_wallpaperflare.com_wallpaper-8.jpg");
  }
</style>
