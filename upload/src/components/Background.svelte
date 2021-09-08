<script lang="ts">
  import {getRandomImageCached} from '../lib/reddit'
  import {onMount} from 'svelte'
  import {fade} from 'svelte/transition'
  import compareDesc from 'date-fns/compareDesc'
  import IconPrevious from "../icons/IconPrevious.svelte";
  import IconNext from "../icons/IconNext.svelte";

  export let changeDelay = 20
  export let maxBackStack = 20
  export let autoChange = true
  export let overlay = true
  export let controls = true

  type BackgroundImage = {
    loaded: boolean
    url: string
    createdAt: Date
  }

  let images: Array<BackgroundImage> = []
  let overlayLoaded = false
  let controlsVisible = false
  let indexShift = 0
  let fetchReady = true
  let timeout: any

  $: ready = images.filter(val => val.loaded)
    .sort((a, b) => compareDesc(a.createdAt, b.createdAt))
    .slice(indexShift, 2)

  console.log(ready)

  function notifyImagesChanged() {
    images = images
  }

  function delayed(callback: () => any) {
		clearTimeout(timeout)
    return new Promise(resolve => {
      timeout = setTimeout(() => {
        resolve(callback())
      }, changeDelay * 1000)
    })
  }

  async function updateBackground() {
    try {
      const img = await getRandomImageCached()
      if (img && fetchReady) {
        fetchReady = false

        const image: BackgroundImage = {
          createdAt: new Date(),
          loaded: false,
          url: img.url
        }

        images.push(image)
	      notifyImagesChanged()

	      images = images.slice(Math.max(images.length - maxBackStack, 0))

        //TODO:: add propper image loading  and error handling
        await fetch(image.url, {
          method: 'GET',
          mode: 'no-cors',
          redirect: 'follow'
        }).catch(err => {
          const deleted = images.splice(images.findIndex(val => val.url === image.url), 1)
          console.error(`Failed to: ${err}\n deleted: ${JSON.stringify(deleted)}`,)
	        notifyImagesChanged()
        }).then(_ => {
          fetchReady = true
          images[images.findIndex(val => val.url === image.url)] = {
            ...image,
            loaded: true
          }
          notifyImagesChanged()
        })
      }

      if (autoChange) {
        return delayed(updateBackground)
      }
    } catch (e) {
      console.error(e)
      return delayed(updateBackground)
    }
  }

  function shiftIndex() {
    indexShift++
    if (indexShift >= images.length - 2) {
      indexShift = images.length - 2
    }

    ready = images.filter(val => val.loaded)
      .sort((a, b) => compareDesc(a.createdAt, b.createdAt))
      .slice(indexShift, 2)

    console.log(indexShift)
  }

  onMount(() => {
    updateBackground()
    if (overlay) {
      fetch('./brush.jpg').then(res => overlayLoaded = true)
    }
  })

</script>

{#if ready.length > 0}
	<div
			class="root"
			transition:fade
			on:mouseover|preventDefault|stopPropagation={() => controlsVisible = true}
	>
		{#if controls && controlsVisible}
			<div
					transition:fade
					class="controls"
					style={`
						z-index: ${maxBackStack + 2};
					`}
			>
				<!--{#if images.length >= 3}-->
				<!--	<button on:click|preventDefault|stopPropagation={shiftIndex}>-->
				<!--		<IconPrevious/>-->
				<!--	</button>-->
				<!--{/if}-->
				<button on:click|stopPropagation|preventDefault={updateBackground}>
					<IconNext/>
				</button>
			</div>
		{/if}
		{#if overlay && overlayLoaded}
			<div
					transition:fade
					class="background"
					style={`
		        background-image: url("./brush.jpg");
		        z-index: ${maxBackStack + 1};
		        filter: opacity(50%);
		        opacity: 0.45;
	       `}
			></div>
		{/if}
		<div class="filter">
			{#each ready as {url}, i (url)}
				<div
						transition:fade
						class="background"
						style={`
		        background-image: url("${url}");
		        z-index: ${i};
		        filter: blur(4px);
	       `}
				></div>
			{/each}
		</div>
	</div>
{/if}

<style>
  .root {
    position: absolute;
    z-index: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-position: center top;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-color: #BDBDBD;
  }

  .background {
    position: absolute;
    z-index: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-position: center top;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    transition: 350ms all ease-out;
  }

  .filter {
    position: absolute;
    z-index: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transition: 350ms all ease-out;
    filter: grayscale(55%);
    opacity: 0.55;
  }

  .controls {
    position: fixed;
    top: 0;
    right: 0;
    margin-right: 16px;
    margin-top: 16px;
    opacity: 0.45;
  }

  .controls > button {
    position: relative;
    width: 32px;
    height: 32px;
    padding: 0;
    margin: 0;
    background: none;
    border: 0;
    outline: none;
    transition: 350ms all ease-out;
    cursor: pointer;
  }

  .controls > button:hover {
    transform: scale(1.1);
  }

  .controls > button:active {
    transform: scale(0.96);
  }
</style>