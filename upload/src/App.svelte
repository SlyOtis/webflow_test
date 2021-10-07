<script lang="ts">
  import Player from "./components/Player.svelte";
  import {
    ref,
    get
  } from 'firebase/database'
  import {database} from "./lib/firebase";

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
    const fileIds = await get(slugRef).then(res => res.exists() ? res.val().fileIds : null)

    if (!fileIds) {
      throw new Error("What the fuck?")
    }

    return fileIds
  }

  async function getInputFile(id: string) {
    return await get(ref(database, 'files/' + id))
        .then(res => res.val())
  }

  //77493D01-F987-47EB-927F-659E1A720B73
</script>

{#if slug?.length > 0}
  {#await getFileIds()}
    <h1>Loading</h1>
  {:then fileIds}
    {#each fileIds as id}
      {#await getInputFile(id)}
        <h3>Loading</h3>
      {:then inn}
        <div class="root">
          <Player src={inn}/>
        </div>
      {/await}
    {/each}
  {/await}
{/if}

<style>

  :root{
    --border: #49CCFF;
    --background: #102A34;
    --text: white;
    --box-width: 232px;
    --box-height: 24px;
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

  :global(body){
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
    padding-right: 16px;
    padding-bottom: 16px;
    width: 100%;
    height: 100%;
  }



</style>
