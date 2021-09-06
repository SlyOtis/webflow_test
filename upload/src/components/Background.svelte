<script lang="ts">
  import {getNextImageCached} from '../lib/reddit'
  import {onMount} from 'svelte'
  import {fade} from 'svelte/transition'
  import compareAsc from 'date-fns/compareDesc'

  export let changeDelay = 20
  export let autoChange = true
  export let overlay = true

  type BackgroundImage = {
    loaded: boolean
    url: string
    createdAt: Date
  }

  let images: Array<BackgroundImage> = []

  $: ready = images.filter(val => val.loaded).sort(compareAsc).slice(0, 2)

  const delayed = (callback: () => any) => new Promise(resolve => setTimeout(() => {
    resolve(callback())
  }, changeDelay * 1000))

  async function updateBackground() {
    const index = images.length
    try {
      const img = await getNextImageCached()

      if (img) {

        const image: BackgroundImage = {
          createdAt: new Date(),
          loaded: false,
          url: img.url
        }

        images.push(image)
        images = images

        await fetch(image.url, {
          method: 'GET',
          mode: 'no-cors',
          redirect: 'follow'
        }).catch(err => {
          console.error(err)
          images.splice(index, 1)
        }).then(res => {
          images[index] = {
            ...image,
            loaded: true
          }
        })

        images = images
      }

      if (autoChange) {
        return delayed(updateBackground)
      }
    } catch (e) {
      console.error(e)
      return delayed(updateBackground)
    }
  }

  onMount(() => {
    updateBackground()
  })

</script>

{#if ready.length > 0}
	<div class="root" transition:fade>
		{#if overlay}
			<div
					class="background"
					style={`
		        background-image: url("./brush.jpg");
		        z-index: 100;
		        filter: opacity(50%);
		        opacity: 0.45;
	       `}
			></div>
		{/if}
		<div class="filter">
			{#each images as image, i }
				<div
						transition:fade
						class="background"
						style={`
		        background-image: url("${image.url}");
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
</style>