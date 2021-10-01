<script lang="ts">
  import Loading from "./components/Loading.svelte";
  import Player from './Player.svelte'

  const upload = location.pathname.startsWith("/upload")
  console.log(upload)

</script>

{#if upload}
	{#await import("./Upload.svelte")}
		<Loading />
	{:then Upload}
		<svelte:component this={Upload.default} />
	{/await}
{:else }
	<Player />
{/if}