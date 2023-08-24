<script lang="ts">
    import { page } from "$app/stores";

    $: {
        if (typeof gtag !== "undefined" && $page.url.hostname !== "localhost") {
            gtag("config", "G-Y539LDK705", {
                page_title: document.title,
                page_path: $page.url.pathname,
            });
        }
    }
</script>

<svelte:head>
    <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-Y539LDK705"
    >
    </script>
    <script>
        if ($page.url.hostname !== "localhost") {
            window.dataLayer = window.dataLayer || [];

            function gtag() {
                dataLayer.push(arguments);
            }

            gtag("js", new Date());
            gtag("config", "G-Y539LDK705");
        }
    </script>
</svelte:head>
