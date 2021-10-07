<script lang="ts">
  import Player from "./components/Player.svelte";
  import {
    ref,
    get
  } from 'firebase/database'
  import {database} from "./lib/firebase";
  import IconSpinner from "./icons/IconSpinner.svelte";
  import {HandlerQueue, InputFile} from "./lib/utils";

  import {writable} from "svelte/store";
  import {onMount} from "svelte";

  const files = writable<Array<{ id: string, inn?: InputFile }>>([])

  const queue = new HandlerQueue<string>(getInputFile)

  const paths = location.pathname.split('/')
  const slug = paths[paths.length - 1]

  const params = new URLSearchParams(location.search)
  const size = {
    width: Number(params.get("w") || 232),
    height: Number(params.get("h") || 24),
  }

  document.documentElement.style.setProperty('--box-width', size.width + 'px')
  document.documentElement.style.setProperty('--box-height', size.height + 'px')

  async function getFileIds() {
    //TODO:: Throw on no key
    const slugRef = ref(database, 'slugs/' + slug)
    const fileIds: Array<string> = await get(slugRef).then(res => res.exists() ? res.val().fileIds : null)

    if (!fileIds) {
      throw new Error("What the fuck?")
    }

    files.set(fileIds.map(el => {
      queue.post(el)
      return {id: el}
    }))

    return fileIds
  }

  async function getInputFile(id: string) {
    return await get(ref(database, 'files/' + id))
        .then(res => res.val())
        .then(async (inn: InputFile) => {
          await preloadUrl(inn.waveUrl)
          await preloadUrl(inn.audioUrl)

          files.update(state => {
            const index = state.findIndex(el => el.id === id)

            state[index] = {
              ...state[index],
              inn
            }

            return state
          })

          return id
        })
  }

  async function preloadUrl(url: string): Promise<boolean> {
    const img = new Image()
    return new Promise<boolean>(resolve => {
      img.onload = el => {
        resolve(true)
      }

      img.onerror = el => {
        resolve(false)
      }

      img.src = url
    })
  }

  onMount(() => {
    getFileIds()
  })

  //77493D01-F987-47EB-927F-659E1A720B73
</script>

{#if slug?.length > 0}
  {#if $files.length}
    {#each $files as file}
      <div class="root">
        {#if file?.inn}
          <Player src={file.inn}/>
        {:else }
          <div class="boxnes">
            <IconSpinner/>
          </div>
        {/if}
      </div>
    {/each}
  {:else}
    <IconSpinner/>
  {/if}
{/if}

<style>

  :root {
    --border: #49CCFF;
    --background: #102A34;
    --loading: #49CCFF;
    --text: white;
    --box-width: 232px;
    --box-height: 24px;
    --loading-bck: rgba(73, 204, 255, 0);
    --loading-bbtm: rgba(73, 204, 255, 0);
    --loading-top: rgba(73, 204, 255, 0.8);
  }

  .root {
    position: relative;
    display: flex;
    width: auto;
    height: auto;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    border-radius: 8px;
    padding: 8px;
    border: 2px solid var(--border);
    background-color: var(--background);
    overflow: hidden;
    fill: var(--text);
    color: var(--text);
    margin-left: 16px;
    margin-top: 16px;
  }

  .boxnes {
    position: relative;
    width: var(--box-width);
    height: var(--box-height);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  :global(html) {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :global(body) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding-right: 16px;
    padding-bottom: 16px;
    width: 100%;
    height: auto;
  }


</style>
