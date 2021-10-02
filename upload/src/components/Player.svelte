<script lang="ts">
  import type {InputFile} from "../lib/utils";
  import IconPause from "../icons/IconPause.svelte";
  import IconPlay from "../icons/IconPlay.svelte";
  import Waveform from "./Waveform.svelte";
  import IconAudio from "../icons/IconAudio.svelte";

  export let src: InputFile;
  export let width = 200;
  export let updateRate = 60

  let player: HTMLAudioElement
  let playing: boolean = false
  let canPlay: boolean = false
  let progress: number = 0
  let playback: any
  let useFile: boolean = !!src.file
  let _src: string = useFile ? URL.createObjectURL(src.file) : src.audioUrl

  function stopPlayback() {
    clearTimeout(playback)
    progress = 0
    playing = false
  }

  function startPlayback() {
    clearTimeout(playback)
    progress = (player?.currentTime || 0)
    const dur = (player?.duration || 0.1)
    playback = setInterval(() => {
      progress = (player.currentTime / dur) * 100
    }, updateRate)

    playing = true
  }

  function playPause() {
    if (playing) {
      stopPlayback()
      player.pause()
    } else {
      player.play()
      startPlayback()
    }
  }

  function onPlaying(e) {
    switch (e.type) {
      case 'play':
      case 'playing':
        break
      default:
        stopPlayback()
        break
    }
  }

</script>

<div class="root" class:boxnes={!useFile}>
  <div class="play-pause" on:click|preventDefault|stopPropagation={playPause}>
    {#if playing}
      <IconPause/>
    {:else }
      <IconPlay/>
    {/if}
  </div>

  <div class="waveform-container" style={`
    width: ${width}px;
  `}>
    {#if useFile && src.data}
      <div class="waveform-wrapper overlay" style="right: {(100 - progress)}%;">
        <div class="waveform-item" style="width: {width}px;">
          <Waveform
              data={src.data}
              class="waveform-scroll"
              noAnimation
          />
        </div>
      </div>
      <div class="waveform-wrapper" style="left: {progress}%;">
        <div class="waveform-item" style="width: {width}px;">
          <Waveform
              data={src.data}
              color="white"
              class="waveform-scroll"
          />
        </div>
      </div>
    {:else if !useFile }
      <div class="waveform-wrapper overlay" style="right: {(100 - progress)}%;">
        <div class="waveform-item" style={`
          width: ${width}px;
          min-width: ${width}px;
          max-width: ${width}px;
        `}>
          {@html src.svgData}
        </div>
      </div>
      <div class="waveform-wrapper" style="left: {progress}%;">
        <div class="waveform-item" style={`
          width: ${width}px;
          min-width: ${width}px;
          max-width: ${width}px;
        `}>
          {@html src.svgData}
        </div>
      </div>
    {:else }
      <IconAudio/>
    {/if}
  </div>

  <audio
      bind:this={player}
      on:canplay={() => canPlay = true}
      on:error={() => canPlay = false}
      on:playing={onPlaying}
      on:play={onPlaying}
      on:pause={onPlaying}
      on:abort={onPlaying}
      on:ended={onPlaying}
  >
    <source src={_src} type="audio/wav">
  </audio>
</div>

<style>

  .root {
    position: relative;
    width: auto;
    min-width: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
  }

  .play-pause {
    position: relative;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    fill: var(--text);
    color: var(--text);
    z-index: 1;
    transition: 350ms all ease-out;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .play-pause:hover, .play-pause:focus {
    transform: scale(1.1);
  }

  .play-pause:active {
    transform: scale(0.9);
  }

  audio {
    position: absolute;
    z-index: 0;
  }

  .waveform-container {
    position: relative;
    width: 100%;
    height: 100%;
    margin-left: 16px;
    margin-right: 16px;
    padding: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
  }

  .overlay {
    z-index: 2 !important;
    fill: var(--border);
    color: var(--border);
    stroke: var(--border);
  }

  .overlay > .waveform-item {
    left: 0;
  }

  .waveform-item {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
  }

  .waveform-wrapper {
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    will-change: right, left;
  }

  .waveform-wrapper > .waveform-item {
    right: 0;
  }

  .boxnes {
    position: relative;
    width: auto;
    height: 40px;
    padding-left: 8px;
    max-width: 232px;
    min-width: 100px;
  }

  .boxnes > .waveform-container {
    margin-right: 8px;
    margin-left: 8px;
  }


</style>
