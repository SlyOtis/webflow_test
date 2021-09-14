<script lang="ts">
  import type {ProgressInfo} from "../lib/utils";

  export let info: ProgressInfo = null
  export let title: string = null
  export let color: string = 'green'

</script>

{#if info}
	<div class="root">
		{#if title}
			<span class="title">{title}</span>
		{/if}
		<span class="count">{info.index}/{info.total}</span>
		<div class="progress">
			<span class="current" style="background-color: {color};transform: scaleX({info.progress});"></span>
		</div>
	</div>
{/if}

<style>
  .root {
	  position: relative;
	  width: 100%;
	  height: auto;
	  display: grid;
	  grid-template-columns: 1fr auto;
	  grid-auto-rows: auto;
	  gap: 4px;
	  user-select: none;
  }

  .root:not(:first-of-type) {
	  margin-top: 4px;
  }

  .title {
	  grid-row: 1;
	  grid-column: 1 / 1;
  }

  .count {
	  grid-row: 1;
    grid-column: 2 / 2;
  }

  .progress {
	  grid-row: 2;
	  grid-column: 1 / span 2;
	  position: relative;
	  height: 4px;
	  border-radius: 2px;
	  background-color: #BDBDBD;
	  overflow: hidden;
  }

  .current {
    position: absolute;
	  width: 100%;
	  height: 100%;
	  transform-origin: left center;
	  z-index: 1;
	  top: 0;
	  left: 0;
	  bottom: 0;
	  transition: 250ms all ease-out;
  }


</style>