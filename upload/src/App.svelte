<script lang="ts">
  import FileUpload from "./components/FileUpload.svelte";
  import type {InputFile} from "./lib/utils";
  import WaveformData from 'waveform-data/dist/waveform-data'
  import Background from "./components/Background.svelte";
  import LogoHerro from "./components/LogoHerro.svelte";

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
    }).then((res: WaveformData) => {
      console.log(res)
    })
  }

  function onInput({detail}: {detail: InputFile}) {
    generateWave(detail)
  }

</script>

<main>
  <LogoHerro />
  <Background />
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
    background-color: #EEEEEE;
    overflow: hidden;
  }
</style>
