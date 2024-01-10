<script lang="ts">
    import { onMount } from "svelte";
    import { PUBLIC_APIPATH } from "$env/static/public";
    import { fade } from "svelte/transition";
    import WeaponHint from "$lib/components/weaponQuiz/weaponHint.svelte";
    import Footer from "$lib/components/global/footer.svelte";
    import HowToPlay from "$lib/components/weaponQuiz/howToPlay.svelte";
    import GameResult from "$lib/components/weaponQuiz/gameResult.svelte";
    export let data;

    let syncedLocalStorage: boolean = false;

    let filteredWeapons: any[] = [];
    let weaponClicked: boolean = false;

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

    const filterWeapons = () => {
        handleFilteredWeaponsOpen();
        weaponClicked = false;
        let storageArr: any[] = [];
        if (inputValue) {
            for (var i = 0; i < data.weapons.length; i++) {
                let weapon = data.weapons[i];
                if (
                    weapon.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) &&
                    storageArr.indexOf(weapon) == -1 &&
                    submittedWeapons.indexOf(weapon) == -1
                ) {
                    storageArr = [...storageArr, weapon];
                }
            }
        }
        filteredWeapons = storageArr;
    };

    const setInputVal = (weaponName: string) => {
        weaponClicked = true;
        inputValue = weaponName;
        filteredWeapons = [];
        document.querySelector("#weapon-input")?.focus();
    };

    let searchInput: HTMLInputElement;
    let inputValue: string = "";

    $: if (!inputValue) {
        filteredWeapons = [];
    }

    let filteredWeaponsOpen: boolean = false;

    const handleFilteredWeaponsOpen = () => {
        filteredWeaponsOpen = true;
        document.body.addEventListener("click", handleFilteredWeaponsClose);
    };

    const handleFilteredWeaponsClose = () => {
        filteredWeaponsOpen = false;
        document.body.removeEventListener("click", handleFilteredWeaponsClose);
    };

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

    const submitValue = () => {
        if (
            inputValue &&
            weaponNames.includes(inputValue) &&
            submittedWeapons.indexOf(
                data.weapons[weaponNames.indexOf(inputValue)]
            )
        ) {
            if (
                submittedWeapons.length == 0 &&
                inputValue != correctWeapon.name
            ) {
                reportResult(0);
            }
            submittedWeapons = [
                data.weapons[weaponNames.indexOf(inputValue)],
                ...submittedWeapons,
            ];
            submittedWeaponsName = [
                data.weapons[weaponNames.indexOf(inputValue)].name,
                ...submittedWeaponsName,
            ];
            localStorage.setItem(
                "submittedWeapons",
                JSON.stringify(submittedWeaponsName)
            );
            if (inputValue == correctWeapon.name) {
                reportResult(1);
                alert(
                    "You Win!\nYou guessed today's weapon in " +
                        submittedWeapons.length.toString() +
                        (submittedWeapons.length == 1 ? " try!" : " tries!")
                );
            }
            inputValue = "";
        }
    };

    async function reportResult(success: number) {
        const response = await fetch(
            PUBLIC_APIPATH +
                "reportResult.php?date=" +
                data.initialData.date +
                "&success=" +
                success.toString() +
                "&token=" +
                encodeURIComponent(localStorage.getItem("token"))
        );
        localStorage.setItem("rank", (await response.json()).rank);
    }

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

    $: weaponHintData = {
        submittedWeapons: submittedWeapons,
        correctWeapon: correctWeapon,
        gameFinished: gameFinished
    }

    $: gameResultData = {
        gameFinished: gameFinished,
        correctWeapon: correctWeapon,
        data: data
    }
</script>

{#if syncedLocalStorage}
    <main class="-translate-y-4">
        <div>
            <div
                class="mx-auto translate-y-1/2 w-64 h-14 bg-[#495EAB] border-[1.5px] border-black rounded-3xl flex items-center"
            >
                <p class="mx-auto text-2xl">Guess today's weapon!</p>
            </div>
            <div
                class="mx-auto w-80 h-fit bg-[#1C2443]/95 border-[1.5px] border-black rounded-xl flex flex-col pt-8 px-2"
            >
                <WeaponHint {weaponHintData}/>
                {#if !gameFinished}
                    <div class="w-full mb-2">
                        <form
                            autocomplete="off"
                            on:submit|preventDefault={submitValue}
                        >
                            <div class="flex gap-1">
                                <input
                                    id="weapon-input"
                                    class="w-full h-9 bg-[#2C3A74] border-[1.5px] border-[#4157A4] rounded-lg text-xl p-2"
                                    type="text"
                                    placeholder="Type any weapon to begin..."
                                    bind:this={searchInput}
                                    bind:value={inputValue}
                                    on:input|stopPropagation={filterWeapons}
                                />
                                <button on:click|preventDefault={submitValue}>
                                    <img
                                        class="transition ease-in-out hover:brightness-125 duration-300 w-12 h-9 bg-[#2C3A74] border-[1.5px] border-[#4157A4] rounded-lg object-fill"
                                        src="/images/playbutton.png"
                                        alt="submit button"
                                    />
                                </button>
                            </div>

                            {#if filteredWeapons.length > 0 && filteredWeaponsOpen}
                                <ul
                                    class="mt-4 mx-auto w-80 max-h-56 h-fit bg-[#2C3A74] border-[1.5px] border-black rounded-xl absolute left-1/2 translate-x-[-50%] overflow-y-auto"
                                >
                                    {#each filteredWeapons as weapon, i}
                                        <li
                                            class="py-2 pl-3 flex items-center cursor-pointer hover:border-[2px] hover:border-sky-200 hover:rounded-xl w-full"
                                            on:click={() =>
                                                setInputVal(weapon.name)}
                                        >
                                            <img
                                                class="mr-4 w-8 h-8 object-contain"
                                                src={"/images/weapons/" +
                                                    weapon.id +
                                                    ".png"}
                                                alt={weapon.name}
                                            />
                                            <p>{weapon.name}</p>
                                        </li>
                                    {/each}
                                </ul>
                            {:else if inputValue != "" && !weaponClicked && filteredWeaponsOpen}
                                <ul
                                    class="mt-4 mx-auto w-80 max-h-56 h-fit border-[1.5px] border-black rounded-xl absolute left-1/2 translate-x-[-50%] overflow-y-auto"
                                >
                                    <li
                                        class="py-2 pl-3 flex items-center bg-[#2C3A74] w-full"
                                    >
                                        <p>No results.</p>
                                    </li>
                                </ul>
                            {/if}
                        </form>
                    </div>
                {/if}
            </div>
        </div>

        <GameResult { gameResultData }/>

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
        <HowToPlay/>
        <Footer/>
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
