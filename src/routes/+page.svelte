<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Footer from "$lib/components/global/footer.svelte";
    import HowToPlay from "$lib/components/weaponQuiz/howToPlay.svelte";
    import GameResult from "$lib/components/weaponQuiz/gameResult.svelte";
    import QuizMain from "$lib/components/global/quizMain.svelte";
    export let data;

    let syncedLocalStorage: boolean = false;

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

    $: gameFinished = submittedWeapons.includes(correctWeapon);

    const haveOverlappingElements = (arr1: any[], arr2: any[]) => {
        for (let i = 0; i < arr1.length; i++) {
            if (arr2.includes(arr1[i])) {
                return true;
            }
        }
        return false;
    };

    let knockbacks = [
        "No knockback",
        "Extremely weak",
        "Very weak",
        "Weak",
        "Average",
        "Strong",
        "Very strong",
        "Extremely strong",
        "Insane",
    ];

    let speeds = [
        "Insanely fast",
        "Very fast",
        "Fast",
        "Average",
        "Slow",
        "Very slow",
        "Extremely slow",
    ];

    let weaponNames: string[] = [];

    for (let i = 0; i < data.weapons.length; i++) {
        weaponNames.push(data.weapons[i].name);
    }

    let correctWeapon = data.weapons.filter(function (weapon) {
        return weapon.id == data.initialData.answer;
    })[0];

    let yesterdayWeapon = data.weapons.filter(function (weapon) {
        return weapon.id == data.initialData.yesterdayAnswer;
    })[0];

    // console.log(correctWeapon, data.initialData);

    let submittedWeapons: any[] = [];
    let submittedWeaponsName: string[] = [];

    const submitWeapon = (event: Event) => {
        submittedWeapons = [
            data.weapons[weaponNames.indexOf(event.detail.inputValue)],
            ...submittedWeapons,
        ];
        submittedWeaponsName = [
            data.weapons[weaponNames.indexOf(event.detail.inputValue)].name,
            ...submittedWeaponsName,
        ];
    };

    onMount(() => {
        if (localStorage.getItem("token") == null) {
            localStorage.setItem("token", data.initialData.token);
        }
        if (
            localStorage.getItem("sessionDate") != null &&
            JSON.parse(localStorage.getItem("sessionDate")!) !=
                data.initialData.date
        ) {
            localStorage.removeItem("sessionDate");
            localStorage.removeItem("submittedWeapons");
            localStorage.removeItem("rank");
        }
        localStorage.setItem(
            "sessionDate",
            JSON.stringify(data.initialData.date)
        );
        if (localStorage.getItem("submittedWeapons") != null) {
            JSON.parse(localStorage.getItem("submittedWeapons")!).forEach(
                (weaponName: string) => {
                    submittedWeapons.push(
                        data.weapons[weaponNames.indexOf(weaponName)]
                    );
                    submittedWeaponsName = [
                        data.weapons[weaponNames.indexOf(weaponName)].name,
                        ...submittedWeaponsName,
                    ];
                }
            );
        }
        gameFinished = submittedWeapons.includes(correctWeapon);
        syncedLocalStorage = true;
    });

    $: gameResultData = {
        gameFinished: gameFinished,
        correctWeapon: correctWeapon,
        data: data,
    };

    $: quizMainData = {
        gameFinished: gameFinished,
        submittedWeapons: submittedWeapons,
        submittedWeaponsName: submittedWeaponsName,
        correctWeapon: correctWeapon,
        data: data,
        weaponNames: weaponNames,
    };
</script>

{#if syncedLocalStorage}
    <main class="-translate-y-4">
        <QuizMain {quizMainData} on:submit={submitWeapon} />

        <GameResult {gameResultData} />

        {#if submittedWeapons.length == 0}
            <p class="mt-1 text-center">
                {data.initialData.successCount} people have guessed today's weapon!
            </p>
            <div class="mt-6 flex flex-col justify-center items-center text-xl">
                <p>Yesterday's weapon was...</p>
                <img
                    style="border-color: {rarityColors[
                        parseInt(yesterdayWeapon.rarity)
                    ].toLowerCase()};"
                    class="mt-2 p-2 w-16 h-16 ml-1 bg-black/60 object-contain roudned-lg border-2"
                    src={"/images/weapons/" + yesterdayWeapon.id + ".png"}
                    alt={yesterdayWeapon.name}
                />
                <p
                    style="color: {rarityColors[
                        parseInt(yesterdayWeapon.rarity)
                    ].toLowerCase()};"
                    class="mt-1"
                >
                    {yesterdayWeapon.name}
                </p>
            </div>
        {:else}
            <div class="mx-auto w-80 md:w-full overflow-auto">
                <div
                    class="mt-4 mx-auto w-fit bg-black/60 flex gap-1 justify-center items-center text-center"
                    transition:fade
                >
                    <div class="w-20">Item</div>
                    <div class="w-20">Damage Type</div>
                    <div class="w-20">Damage</div>
                    <div class="w-20">Knockback</div>
                    <div class="w-20">Speed</div>
                    <div class="w-20">Rarity</div>
                    <div class="w-20">Autoswing</div>
                    <div class="w-20">Material</div>
                    <div class="w-20">Obtained</div>
                </div>

                <ul class="mx-auto w-fit">
                    {#each submittedWeapons as weapon (weapon.id)}
                        <li
                            class="mt-4 flex gap-1 justify-center items-center"
                            transition:fade
                        >
                            <div
                                class="w-20 h-16 bg-black/50 border-2 border-black flex items-center text-center"
                            >
                                <img
                                    class="w-12 h-8 mx-auto object-contain"
                                    src={"/images/weapons/" +
                                        weapon.id +
                                        ".png"}
                                    alt={weapon.name}
                                />
                            </div>
                            <div
                                class="w-20 h-16 {weapon.damageType ==
                                correctWeapon.damageType
                                    ? 'bg-green-500'
                                    : 'bg-red-500'} border-2 border-black flex items-center text-center"
                            >
                                <div class="flex items-center mx-auto">
                                    <p>{weapon.damageType}</p>
                                </div>
                            </div>
                            <div
                                class="w-20 h-16 {weapon.damage ==
                                correctWeapon.damage
                                    ? 'bg-green-500'
                                    : 'bg-red-500'} border-2 border-black flex items-center text-center"
                            >
                                <div class="flex items-center mx-auto">
                                    <p class="w-14">{weapon.damage}</p>
                                    {#if parseInt(weapon.damage) < parseInt(correctWeapon.damage)}
                                        <p>↑</p>
                                    {:else if parseInt(weapon.damage) > parseInt(correctWeapon.damage)}
                                        <p>↓</p>
                                    {/if}
                                </div>
                            </div>
                            <div
                                class="w-20 h-16 {weapon.knockback ==
                                correctWeapon.knockback
                                    ? 'bg-green-500'
                                    : 'bg-red-500'} border-2 border-black flex items-center text-center"
                            >
                                <div class="flex items-center mx-auto">
                                    <p class="w-14">{weapon.knockback}</p>
                                    {#if knockbacks.indexOf(weapon.knockback) < knockbacks.indexOf(correctWeapon.knockback)}
                                        <p>↑</p>
                                    {:else if knockbacks.indexOf(weapon.knockback) > knockbacks.indexOf(correctWeapon.knockback)}
                                        <p>↓</p>
                                    {/if}
                                </div>
                            </div>
                            <div
                                class="w-20 h-16 {weapon.speed ==
                                correctWeapon.speed
                                    ? 'bg-green-500'
                                    : 'bg-red-500'} border-2 border-black flex items-center text-center"
                            >
                                <div class="flex items-center mx-auto">
                                    <p class="w-14">{weapon.speed}</p>
                                    {#if speeds.indexOf(weapon.speed) > speeds.indexOf(correctWeapon.speed)}
                                        <p>↑</p>
                                    {:else if speeds.indexOf(weapon.speed) < speeds.indexOf(correctWeapon.speed)}
                                        <p>↓</p>
                                    {/if}
                                </div>
                            </div>
                            <div
                                class="w-20 h-16 {weapon.rarity ==
                                correctWeapon.rarity
                                    ? 'bg-green-500'
                                    : 'bg-red-500'} border-2 border-black flex items-center text-center"
                            >
                                <div class="flex items-center mx-auto">
                                    <img
                                        class="w-14 max-h-4 object-contain"
                                        src={"/images/rarity/" +
                                            weapon.rarity +
                                            ".png"}
                                        alt={"rarity " + weapon.rarity}
                                    />
                                    {#if parseInt(weapon.rarity) < parseInt(correctWeapon.rarity)}
                                        <p>↑</p>
                                    {:else if parseInt(weapon.rarity) > parseInt(correctWeapon.rarity)}
                                        <p>↓</p>
                                    {/if}
                                </div>
                            </div>
                            <div
                                class="w-20 h-16 {weapon.autoswing ==
                                correctWeapon.autoswing
                                    ? 'bg-green-500'
                                    : 'bg-red-500'} border-2 border-black flex items-center text-center"
                            >
                                <div class="flex items-center mx-auto">
                                    <p>{weapon.autoswing ? "Yes" : "No"}</p>
                                </div>
                            </div>
                            <div
                                class="w-20 h-16 {weapon.material ==
                                correctWeapon.material
                                    ? 'bg-green-500'
                                    : 'bg-red-500'} border-2 border-black flex items-center text-center"
                            >
                                <div class="flex items-center mx-auto">
                                    <p>{weapon.material ? "Yes" : "No"}</p>
                                </div>
                            </div>
                            {#if weapon.obtained.join(" ") == correctWeapon.obtained.join(" ")}
                                <div
                                    class="w-20 h-16 bg-green-500 border-2 border-black flex items-center text-center"
                                >
                                    <div class="flex items-center mx-auto">
                                        <div class="flex flex-col">
                                            {#each weapon.obtained as obtained}
                                                <p>{obtained}</p>
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                            {:else if haveOverlappingElements(weapon.obtained, correctWeapon.obtained)}
                                <div
                                    class="w-20 h-16 bg-amber-500 border-2 border-black flex items-center text-center"
                                >
                                    <div class="flex items-center mx-auto">
                                        <div class="flex flex-col">
                                            {#each weapon.obtained as obtained}
                                                <p>{obtained}</p>
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                            {:else if weapon.obtained.join(" ") != correctWeapon.obtained.join(" ")}
                                <div
                                    class="w-20 h-16 bg-red-500 border-2 border-black flex items-center text-center"
                                >
                                    <div class="flex items-center mx-auto">
                                        <div class="flex flex-col">
                                            {#each weapon.obtained as obtained}
                                                <p>{obtained}</p>
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                            {/if}
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
        <HowToPlay />
        <Footer />
    </main>
{/if}

<style>
    * {
        text-shadow: 0px 0px 3px black;
    }

    input::placeholder {
        color: #808080;
        font-size: 1.25rem; /* 20px */
        line-height: 1.75rem; /* 28px */
        text-align: left;
    }
</style>
