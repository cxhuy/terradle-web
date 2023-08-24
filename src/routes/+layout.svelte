<script>
    import "../app.css";
    import Analytics from "$lib/analytics.svelte";
</script>

<Analytics />

<div class="h-screen w-full flex bg-black/30 backdrop-blur-sm overflow-auto">
    <div class="w-full">
        <div class="mt-8 w-full h-24 px-3">
            <img
                class="mx-auto w-80 drop-shadow-2xl"
                src="/logo.png"
                alt="logo"
            />
        </div>
        <slot />
    </div>
</div>
