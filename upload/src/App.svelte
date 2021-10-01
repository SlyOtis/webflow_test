<script lang="ts">
  import Loading from "./components/Loading.svelte";
  import Player from './Player.svelte'


</script>

{#if location.pathname.startsWith("/upload")}
	{#await import("./Upload.svelte")}
		<Loading />
	{:then Upload}
		<svelte:component this={Upload.default} />
	{/await}
{:else }
	<Player />
{/if}