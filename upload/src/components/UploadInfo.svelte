<script lang="ts">
  import type {InputFile, ProgressInfo} from "../lib/utils";
  import ProgressBar from "./ProgressBar.svelte";
  import fileStore from "../lib/stores";

  export let files: Array<InputFile>
  $: files = Object.keys($fileStore).map(key => $fileStore[key])

  //TODO:: Do this on add or update ?
  const processFiles = (input: Array<InputFile>) => {
    const info = input.reduce((prev, curr) => {
      const upload = curr?.upload?.progress || 0
      const processing = curr?.processing?.progress || 0

      return {
        uploads: {
          ...prev.uploads,
          total: prev.uploads.total + 1,
          ...upload >= 1 && {
            index: prev.uploads.index + 1
          },
          progress: prev.uploads.progress + upload
        },
        processing: {
          ...prev.processing,
          total: prev.processing.total + 1,
          ...processing >= 1 && {
            index: prev.processing.index + 1
          },
          progress: prev.processing.progress + processing
        },
				associated: {
        	...prev.associated,
					total: prev.associated.total + 1,
					...curr.refId && {
        		index: prev.associated.index + 1
					}
				}
      }
    }, {
    	associated: {
    		total: 0,
				index: 0,
				progress: 0
			},
      uploads: {
        total: 0,
        index: 0,
        progress: 0
      },
      processing: {
        total: 0,
        index: 0,
        progress: 0
      }
    })

    info.processing.progress = info.processing.progress / info.processing.total
    info.uploads.progress = info.uploads.progress / info.uploads.total
    info.associated.progress = info.associated.index / info.associated.total
    return info
  }

  $: info = processFiles(files)

</script>

{#if files?.length}
	<div class="root card-background">
		<ProgressBar title="Uploading" info={info.uploads} />
		<ProgressBar title="Processing" info={info.processing} />
		<ProgressBar title="Associated" info={info.associated} />
	</div>
{/if}

<style>
  .root {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    border-radius: 8px;
    transition: 350ms all ease-out;
	  margin-top: 32px;
	  padding: 8px 16px;
	  min-width: 20vw;
  }
</style>


