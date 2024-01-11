<script lang="ts">
    import { onMount } from "svelte";

    type GameResultData = {
        correctWeapon: Object;
        data: Object;
    };
    export let gameResultData: GameResultData;

    let date: Date = new Date(
        new Date().toLocaleString("en-US", {
            timeZone: "America/Chicago",
        })
    );
    let midnight: Date = new Date(date);
    midnight.setHours(24, 0, 0, 0);

    $: diff = midnight.getTime() - date.getTime();

    $: nextQuiz = [
        Math.floor(diff / (1000 * 60 * 60))
            .toString()
            .padStart(2, "0"),
        Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            .toString()
            .padStart(2, "0"),
        Math.floor((diff % (1000 * 60)) / 1000)
            .toString()
            .padStart(2, "0"),
    ];

    let rarityColors: string[] = [
        "#FFFFFF",
        "#9696FF",
        "#96FF96",
        "#FFC896",
        "#FF9696",
        "#FF96FF",
        "#D2A0FF",
        "#96FF0A",
        "#FFFF0A",
        "#05C8FF",
        "#FF2864",
        "#B428FF",
    ];

    async function getRank() {
        if (localStorage.getItem("rank") == null) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
        return localStorage.getItem("rank");
    }

    onMount(() => {
        const interval = setInterval(() => {
            date = new Date(
                new Date().toLocaleString("en-US", {
                    timeZone: "America/Chicago",
                })
            );
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });
</script>

<p class="mt-1 text-center">
    {gameResultData.data.initialData.successCount} people have guessed today's weapon!
</p>
<div class="mx-auto w-80 h-fit flex flex-col gap-y-2 p-2">
    {#await getRank()}
        <p class="mx-auto">Loading...</p>
    {:then rank}
        <p class="mx-auto">
            You are the {rank +
                /*This check will fail if that was the 11th, 111th, 211th, ... guess even if the number ends in 1.*/
                (parseInt(rank) % 10 == 1 && parseInt(rank) % 100 != 11
                    ? "st"
                    : /*This check will fail if that was the 12th, 112th, 212th, ... guess even if the number ends in 2.*/
                      parseInt(rank) % 10 == 2 && parseInt(rank) % 100 != 12
                      ? "nd"
                      : /*This check will fail if that was the 13th, 113th, 213th, ... guess even if the number ends in 3.*/
                        parseInt(rank) % 10 == 3 && parseInt(rank) % 100 != 13
                        ? "rd"
                        : /*Any number ending in 11, 12 or 13 will land here as appropriate in the English grammar the suffix of the ordinal is "th"*/
                          "th")} to guess today's weapon!
        </p>
    {/await}
    <p class="mb-2 mx-auto text-2xl">
        {#if diff > 0}
            Next quiz in {nextQuiz.join(":")}
        {:else}
            <span class="text-xl">Refresh the page for the next quiz!</span>
        {/if}
    </p>
    <div class="flex gap-x-2">
        <img
            class="mx-auto w-20 h-20 object-contain bg-[#2C3A74] p-2 border-2 border-black rounded-lg"
            src={"/images/weapons/" + gameResultData.correctWeapon.id + ".png"}
            alt={gameResultData.correctWeapon.name}
        />
    </div>
    <div
        class="w-full h-fit mx-auto bg-[#1C2443]/95 p-4 border-2 border-black rounded-lg"
    >
        <ul class="text-xl">
            <li>
                <p
                    style="color: {rarityColors[
                        parseInt(gameResultData.correctWeapon.rarity)
                    ].toLowerCase()};"
                >
                    {gameResultData.correctWeapon.name}
                </p>
            </li>
            <li>
                <p>
                    {[
                        gameResultData.correctWeapon.damage,
                        gameResultData.correctWeapon.damageType.toLowerCase(),
                        "damage",
                    ].join(" ")}
                </p>
            </li>
            <li>
                <p>
                    {[gameResultData.correctWeapon.speed, "speed"].join(" ")}
                </p>
            </li>
            <li>
                <p>
                    {gameResultData.correctWeapon.knockback.toLowerCase() !=
                    "no knockback"
                        ? [
                              gameResultData.correctWeapon.knockback,
                              "knockback",
                          ].join(" ")
                        : "No Knockback"}
                </p>
            </li>
            {#if gameResultData.correctWeapon.material}
                <li>
                    <p>Material</p>
                </li>
            {/if}

            {#if gameResultData.correctWeapon.tooltip != undefined}
                {#each gameResultData.correctWeapon.tooltip as tooltip}
                    <li>
                        <p>{tooltip}</p>
                    </li>
                {/each}
            {/if}
        </ul>
    </div>
</div>