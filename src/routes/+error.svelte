
<script>
	import { page } from '$app/stores';
</script>

<div class="w-full text-center">
    <h1 class="mt-20 text-5xl">{$page.status} {$page.error.message}</h1>
    {#if $page.status == 500}
        <p class="text-2xl">Try refreshing the page</p>
    {:else if $page.status == 404}
        <a href="/" class="text-2xl hover:underline">Go to home</a>
    {/if}
</div>