<script lang="ts">
  import Player from "./components/Player.svelte";
  import type {InputFile} from "./lib/utils";
  import {
    ref,
    get,
    onChildAdded,
    onChildChanged,
    onChildRemoved,
  } from 'firebase/database'
  import {database} from "./lib/firebase";

  const paths = location.pathname.split('/')
  const key = paths[paths.length - 1]

  async function getFileInput() {
    //TODO:: Throw on no key
    const fileId = (await get(ref(database, 'refs/' + key))).val()?.fileId
	  if (!fileId) {
	    throw new Error("What the fuck?")
	  }

	  return await get(ref(database, 'files/' + fileId))
		  .then(res => res.val())
  }

  //77493D01-F987-47EB-927F-659E1A720B73
</script>

{#if key?.length > 4}
	{#await getFileInput()}
		<h1>Loading</h1>
	{:then inn}
		<Player src={inn}/>
	{/await}
{/if}
