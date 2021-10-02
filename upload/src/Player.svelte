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
  const slug = paths[paths.length - 1]

	console.info("Slug", slug)

  async function getFileInput() {
    //TODO:: Throw on no key
		const slugRef = ref(database, 'slugs/' + slug)
    const fileIds = await get(slugRef).then(res => res.exists() ? res.val().filedIds : null)

		if (!fileIds) {
	    throw new Error("What the fuck?")
	  }

	  return await get(ref(database, 'files/' + fileIds[0]))
		  .then(res => res.val())
  }

  //77493D01-F987-47EB-927F-659E1A720B73
</script>

{#if slug?.length > 4}
	{#await getFileInput()}
		<h1>Loading</h1>
	{:then inn}
		<Player src={inn}/>
	{/await}
{/if}
