<script lang="ts">
  import type {InputFile} from "../lib/utils";
  import IconPause from "../icons/IconPause.svelte";
  import IconPlay from "../icons/IconPlay.svelte";
  import {onMount} from "svelte";

  export let src: InputFile;

  let player: HTMLAudioElement
  let playing: boolean = false
  let canPlay: boolean = false

  function playPause(e) {
	  if (playing) player.pause()
	  else player.play()
	  playing = !playing
  }

  function onPlaying(e) {
    playing = !player.paused
	  console.log(e)
  }

</script>

<div class="root">
		<div class="play-pause" on:click={playPause}>
			{#if playing}
				<IconPause />
			{:else }
				<IconPlay />
			{/if}
		</div>
		<audio
				bind:this={player}
				onload=""
				on:canplay={() => canPlay = true}
				on:error={() => canPlay = false}
				on:playing={onPlaying}
				on:play={onPlaying}
				on:pause={onPlaying}
				on:abort={onPlaying}
		>
			<source src={URL.createObjectURL(src.file)} type="audio/wav">
		</audio>
</div>

<style>
	.root {
		flex: 0;
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
</style>
