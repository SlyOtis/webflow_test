<script lang="ts">
  import {WaveformData} from "waveform-data/dist/waveform-data";

  export let data: WaveformData | null = null
  export let samplesPP = 128
  export let blockSize = 2
  export let maxY = 100
  export let sampleWidth = 2
  export let sampleGap = 1
  export let samples: Array<{top: number, bottom: number}> = []
  export let color: String = "#"

  const scaleY = (amplitude, height) => {
    const range = 256;
    const offset = 128;

    const val =  ((Math.abs(amplitude) + offset) * height) / range;
	  const t = (amplitude + offset) / range

	  return val
  }

  const mapSamples = (data: WaveformData) => {
    const channel = data.channel(0)
	  let _samples = []
    for (let x = 0; x < data.length; x++) {
	    const sample = {
        top: scaleY(channel.max_sample(x), maxY),
        bottom: scaleY(channel.min_sample(x), maxY)
      }
      _samples.push(sample);
    }

    return _samples
  }

  $: samples = data && mapSamples(data) || [];

</script>

{#if samples.length > 0}
	<svg
			viewBox="0 0 {samples.length * (sampleGap + sampleWidth)} {maxY * 2}"
			width="100%"
			height="100%"
	>
		{#each samples as {top, bottom}, i}
				<rect
						fill={color}
						x={i * (sampleWidth + sampleGap)}
						y={maxY - top}
						width={sampleWidth}
						height="{Math.abs(top) + Math.abs(bottom)}"
				/>
		{/each}
	</svg>
{/if}
