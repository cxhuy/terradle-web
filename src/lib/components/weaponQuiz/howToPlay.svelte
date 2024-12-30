<script lang="ts">
    import { fade } from "svelte/transition";

    let showHowToPlay: boolean = false;
</script>

<div class="w-full flex items-center">
    <button
        class="mx-auto mt-8 cursor-pointer"
        on:click={() => (showHowToPlay = !showHowToPlay)}
    >
        <p class="text-2xl hover:underline">How to play</p>
    </button>
</div>
{#if showHowToPlay}
    <div class="w-80 mx-auto md:w-fit text-lg flex-col" transition:fade>
        <p>
            • The objective of this game is to guess the WOTD (weapon of the
            day) based on the stats and hints provided throughout the game.
        </p>
        <p class="mt-2">
            • For every weapon submitted, each stat will appear as <span
                class="text-green-500">green</span
            >, <span class="text-amber-500">yellow</span>, or
            <span class="text-red-500">red</span> depending on how close it is to
            the stats of the WOTD.
        </p>
        <p class="mt-2">
            • <span class="text-green-500">Green</span> means the stat is identical
            to that of the WOTD.
        </p>
        <p>
            • <span class="text-yellow-500">Yellow</span> (only for obtained) means
            the guessed weapon shares a way of being obtained with the WOTD, indicating
            that there's an overlap.
        </p>
        <p>
            • <span class="text-red-500">Red</span> means that the stat is wrong.
            For each stat, there will be arrows indicating whether the guessed weapon's
            stat needs to be higher or lower to match the WOTD's corresponding stat.
        </p>
        <p class="ml-3">
            ex) Damage: 54↑ means that the damage stat of the WOTD is higher
            than 54.
        </p>
        <p class="mt-2">
            • Rarity can help tell what stage of the game the weapon is
            available in.
        </p>
        <p class="ml-3">
            Weapons of the same rarity are obtainable at the same stage of the
            game.
        </p>
        <p class="ml-3">
            For more information about rarities, visit <a
                href="https://terraria.wiki.gg/wiki/Rarity"
                target="_blank"
                class="hover:underline">https://terraria.wiki.gg/wiki/Rarity</a
            >
        </p>
        <p class="mt-2">
            • Consumables, Tools, and Phasesabers are not included in the game.
        </p>
        <p class="mt-2">
            • Weapons that can be shimmered are considered materials.
        </p>
        <p class="mt-2">
            • Weapons that can be obtained from crates are considered to be obtainable by chests.
        </p>
        <p class="ml-3">
            Weapons that can be obtained through shimmering are considered to be
            obtainable by crafting.
        </p>
    </div>
{/if}
