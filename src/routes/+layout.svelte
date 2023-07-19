<script>
    import "../app.css";
</script>

<div class="min-h-screen w-full flex bg-black/30 backdrop-blur-sm">
    <div class="mt-8 w-full h-32 p-3">
        <img class="mx-auto h-full drop-shadow-2xl" src="/src/lib/logo.png" alt="logo">
    </div>
    <slot />
</div>