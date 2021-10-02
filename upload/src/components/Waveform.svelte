<script lang="ts">
  import {WaveformData} from "waveform-data/dist/waveform-data";
  import {createEventDispatcher, onMount} from "svelte";
  import "../waveform.css"

  const dispatch = createEventDispatcher()

  export let data: WaveformData | null = null
  export let samplesPP = 128
  export let blockSize = 2
  export let maxY = 100
  export let maxX = 300
  export let sampleWidth = 2
  export let sampleGap = 1
  export let samples: Array<{ top: number, bottom: number }> = []
  export let color: string = "#"
  export let noAnimation = false
  export let id: string = null

  let className: string = null
  export {className as class}

  let svgEl: SVGElement

  const scaleY = (amplitude, height) => {
    const range = 256;
    const offset = 128;

    const val = ((Math.abs(amplitude) + offset) * height) / range;
    const t = (amplitude + offset) / range

    return val
  }

  const mapSamples = (data: WaveformData) => {
    const channel = data.channel(0)
    let _samples = []
    let spp = Math.max(Math.ceil(data.length / maxX), 1)

    for (let x = 0; x < data.length; x += spp) {
      let sample = null
	    let count = 0

      for (let i = x; i < x + spp && i < data.length; i++) {
        sample = {
          top: (sample?.top || 0) + scaleY(channel.max_sample(x), maxY),
          bottom: (sample?.bottom || 0) + scaleY(channel.min_sample(x), maxY)
        }
        count++
      }

      sample = {
        top: sample.top / count,
	      bottom: sample.bottom / count
      }

      _samples.push(sample)
    }

    return _samples
  }

  $: samples = data && mapSamples(data) || [];

  onMount(() => {
	  dispatch("ready", svgEl.cloneNode(true))
  })

</script>

{#if samples.length > 0}
	<svg
			{id}
			bind:this={svgEl}
			class="waveform {className}"
			viewBox="0 0 {samples.length * (sampleGap + sampleWidth)} {maxY * 2}"
			width="100%"
			height="100%"
			fill={color}
	>
		{#each samples as {top, bottom}, i}
			<rect
					x={i * (sampleWidth + sampleGap)}
					y={maxY - top}
					width={sampleWidth}
					height="{Math.abs(top) + Math.abs(bottom)}"
					style={`
							animation-delay: ${i * 2}ms;
							transform-origin: ${i * (sampleWidth + sampleGap)}px center;
						`}
					class:animation={!noAnimation}
			/>
		{/each}
	</svg>
{/if}

<style>

  rect {
    z-index: 1;
  }

  svg {
    position: relative;
    width: 100%;
    height: 100%;
	  padding: 0;
	  margin: 0;
	  color: inherit;
  }
</style>