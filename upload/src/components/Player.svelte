<script lang="ts">
  import type {InputFile} from "../lib/utils";
  import IconPause from "../icons/IconPause.svelte";
  import IconPlay from "../icons/IconPlay.svelte";
  import Waveform from "./Waveform.svelte";
  import IconAudio from "../icons/IconAudio.svelte";

  export let src: InputFile;
  export let width = 305;

  let player: HTMLAudioElement
  let playing: boolean = false
  let canPlay: boolean = false
  let progress: number = 0

  $: progress = player?.currentTime || 0

  function playPause(e) {
    if (playing) player.pause()
    else player.play()
    playing = !playing
  }

  function onPlaying(e) {
    playing = !player.paused

	  if (e.type == 'ended') {
	    player.currentTime = progress = 0
	  }
  }

  function onUpdate(e) {
	  if (e.type == "timeupdate" && player) {
      progress = player.currentTime
	  }
  }
</script>

<div class="root">
	<div class="play-pause" on:click|preventDefault|stopPropagation={playPause}>
		{#if playing}
			<IconPause/>
		{:else }
			<IconPlay/>
		{/if}
	</div>

	{#if src.data}
		<div class="waveform-container">
			<div class="waveform-wrapper overlay" style="right: {(1 - progress) * 100}%;">
				<div class="waveform" style="width: {width}px; left: 0;">
					<Waveform
							data={src.data}
							class="waveform-scroll"
							noAnimation
					/>
				</div>
			</div>
			<div class="waveform-wrapper" style="left: {progress * 100}%;">
				<div class="waveform" style="width: {width}px; right: 0;">
					<Waveform
							data={src.data}
							color="white"
							class="waveform-scroll"
					/>
				</div>
			</div>
		</div>
	{:else }
		<IconAudio/>
	{/if}

	<audio
			bind:this={player}
			onload=""
			on:canplay={() => canPlay = true}
			on:error={() => canPlay = false}
			on:playing={onPlaying}
			on:play={onPlaying}
			on:pause={onPlaying}
			on:abort={onPlaying}
			on:ended={onPlaying}
			on:timeupdate={onUpdate}
	>
		<source src={URL.createObjectURL(src.file)} type="audio/wav">
	</audio>
</div>

<style>

  .root {
    flex: 1;
    position: relative;
    width: 100%;
    min-width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .play-pause {
    position: relative;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    background-color: white;
    fill: #212121;
    color: #212121;
    z-index: 1;
    transition: 350ms all ease-out;
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
    min-width: 300px;
    min-height: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .overlay {
    z-index: 2 !important;
    fill: red;
    color: red;
    stroke: red;
  }

  .waveform {
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
    transition: 50ms all ease-out;
  }

</style>
