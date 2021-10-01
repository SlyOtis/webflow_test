<script lang="ts">
  // import Player from "./components/Player.svelte";
  // import type {InputFile} from "./lib/utils";
  // import {
  //   ref,
  //   get,
  //   onChildAdded,
  //   onChildChanged,
  //   onChildRemoved,
  // } from 'firebase/database'
  // import {database} from "./lib/firebase";

  const paths = location.pathname.split('/')
  const key = paths[paths.length - 1]
  //
  // async function getFileInput() {
  //   const files = await get(ref(database, 'files'))
  //   console.log(files.val())
  //   return files
  // }

</script>

<main>
	<h1>{key}</h1>
	<h2>{location}</h2>
</main>

<embed
		type="text/html"
		src="https://herro-420.web.app/player/"
		width="300px"
		height="200px"
/>

<style>
  main {
    color: white;
  }
</style>
<!--{#await getFileInput()}-->
<!--	<h1>Loading</h1>-->
<!--{:then inn}-->
<!--	{inn}-->
<!--&lt;!&ndash;	<Player src={inn}/>&ndash;&gt;-->
<!--{/await}-->