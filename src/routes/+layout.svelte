<script>
    import "../app.css";
</script>

<div class="min-h-screen w-full flex bg-black/30 backdrop-blur-sm">
    <div class="w-full">
        <div class="mt-8 w-full h-24 px-3">
            <img class="mx-auto w-80 drop-shadow-2xl" src="/src/lib/logo2.png" alt="logo">
        </div>
        <slot />
    </div>
</div>