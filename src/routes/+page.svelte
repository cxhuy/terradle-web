<script lang="ts">
    import { onMount } from "svelte";
    import { PUBLIC_APIPATH } from "$env/static/public";
    import { fade } from "svelte/transition";
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

    let hintsToShow: boolean[] = [false, false, false];
    $: gameFinished = submittedWeapons.includes(correctWeapon);

    $: hint1 = 3 - submittedWeapons.length > 0 && !gameFinished;
    $: hint2 = 8 - submittedWeapons.length > 0 && !gameFinished;
    $: hint3 = 15 - submittedWeapons.length > 0 && !gameFinished;

    const handleHints = (hintToShow: number) => {
        if (hintsToShow[hintToShow]) {
            hintsToShow[hintToShow] = false;
        } else {
            for (let i = 0; i < hintsToShow.length; i++) {
                hintsToShow[i] = false;
            }
            hintsToShow[hintToShow] = true;
        }
    };

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

    console.log(correctWeapon, data.initialData);

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
            if (submittedWeapons.length == 0) {
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
                alert("You Win!");
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
                success.toString(),
            {
                credentials: "include",
            }
        );
    }

    onMount(() => {
        if (
            localStorage.getItem("sessionDate") != null &&
            JSON.parse(localStorage.getItem("sessionDate")!) !=
                data.initialData.date
        ) {
            localStorage.clear();
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
                <div class="w-full flex gap-2 mb-2">
                    <button
                        disabled={hint1}
                        class="w-full h-fit {hint1 ? 'cursor-default' : ''}"
                        on:click={() => handleHints(0)}
                    >
                        <div
                            class="w-full h-fit {hint1
                                ? 'bg-[#2C3A74]/50 border-black'
                                : 'transition ease-in-out hover:brightness-125 duration-300 bg-[#2C3A74]'} border-[1.5px] rounded-lg text-xs text-center flex flex-col py-1 px-2"
                        >
                            <img
                                class="my-1 h-8 object-contain"
                                src="/images/weapons_hint/selling_price_hint.png"
                                alt="selling price"
                            />
                            <p class="mx-auto">Selling price</p>
                            <p>
                                {#if hint1}
                                    in {3 - submittedWeapons.length} tries...
                                {:else if !hintsToShow[0]}
                                    click to reveal
                                {/if}
                            </p>
                        </div>
                    </button>
                    <button
                        disabled={hint2}
                        class="w-full h-fit {hint2 ? 'cursor-default' : ''}"
                        on:click={() => handleHints(1)}
                    >
                        <div
                            class="w-full h-fit {hint2
                                ? 'bg-[#2C3A74]/50 border-black'
                                : 'transition ease-in-out hover:brightness-125 duration-300 bg-[#2C3A74]'} border-[1.5px] rounded-lg text-xs text-center flex flex-col py-1 px-2"
                        >
                            <img
                                class="my-1 h-8 object-contain"
                                src="/images/weapons_hint/tooltip_hint.png"
                                alt="tooltip"
                            />
                            <p class="mx-auto">Tooltip</p>
                            <p class="mx-auto">
                                {#if hint2}
                                    in {8 - submittedWeapons.length} tries...
                                {:else if !hintsToShow[1]}
                                    click to reveal
                                {/if}
                            </p>
                        </div>
                    </button>
                    <button
                        disabled={hint3}
                        class="w-full h-fit {hint3 ? 'cursor-default' : ''}"
                        on:click={() => handleHints(2)}
                    >
                        <div
                            class="w-full h-fit {hint3
                                ? 'bg-[#2C3A74]/50 border-black'
                                : 'transition ease-in-out hover:brightness-125 duration-300 bg-[#2C3A74]'} border-[1.5px] rounded-lg text-xs text-center flex flex-col py-1 px-2"
                        >
                            <img
                                class="my-1 h-8 object-contain"
                                src="/images/weapons_hint/image_hint.png"
                                alt="weapon image"
                            />
                            <p class="mx-auto">Image</p>
                            <p class="mx-auto">
                                {#if hint3}
                                    in {15 - submittedWeapons.length} tries...
                                {:else if !hintsToShow[2]}
                                    click to reveal
                                {/if}
                            </p>
                        </div>
                    </button>
                </div>
                <div
                    class="{!hintsToShow.includes(true)
                        ? 'hidden'
                        : ''} w-full h-fit p-2 mb-2 bg-[#2C3A74] rounded-lg flex items-center text-center"
                >
                    {#if hintsToShow[0]}
                        <p
                            class="w-full {correctWeapon.sell
                                .toLowerCase()
                                .split(' ')
                                .includes('gold')
                                ? 'text-[#C1AD4F]'
                                : correctWeapon.sell
                                      .toLowerCase()
                                      .split(' ')
                                      .includes('silver')
                                ? 'text-[#A0AEAE]'
                                : 'text-[#AB6156]'}"
                        >
                            {"Sell price: " +
                                correctWeapon.sell
                                    ?.replace("Coins", "")
                                    .toLowerCase()}
                        </p>
                    {:else if hintsToShow[1]}
                        <p class="w-full">
                            {#if correctWeapon.tooltip}
                                {correctWeapon.tooltip
                                    ?.join("\n")
                                    .replace(/(?<=\w{2})[^\s!%&'",.?]/g, "-")}
                            {:else}
                                There is no tooltip for this item.
                            {/if}
                        </p>
                    {:else if hintsToShow[2]}
                        <img
                            class="w-16 h-16 mx-auto object-contain blur-sm"
                            src={"/images/weapons/" + correctWeapon.id + ".png"}
                            alt="weapon image hint"
                        />
                    {/if}
                </div>
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

        {#if gameFinished}
            <div class="mx-auto w-80 h-fit flex flex-col gap-y-2 p-2">
                <p class="my-2 mx-auto text-2xl">
                    {#if diff > 0}
                        Next quiz in {nextQuiz.join(":")}
                    {:else}
                        <span class="text-xl"
                            >Refresh the page for the next quiz!</span
                        >
                    {/if}
                </p>
                <div class="flex gap-x-2">
                    <img
                        class="mx-auto w-20 h-20 object-contain bg-[#2C3A74] p-2 border-2 border-black rounded-lg"
                        src={"/images/weapons/" + correctWeapon.id + ".png"}
                        alt={correctWeapon.name}
                    />
                </div>
                <div
                    class="w-full h-fit mx-auto bg-[#1C2443]/95 p-4 border-2 border-black rounded-lg"
                >
                    <ul class="text-xl">
                        <li>
                            <p
                                style="color: {rarityColors[
                                    parseInt(correctWeapon.rarity)
                                ].toLowerCase()};"
                            >
                                {correctWeapon.name}
                            </p>
                        </li>
                        <li>
                            <p>
                                {[
                                    correctWeapon.damage,
                                    correctWeapon.damageType.toLowerCase(),
                                    "damage",
                                ].join(" ")}
                            </p>
                        </li>
                        <li>
                            <p>
                                {[correctWeapon.speed, "speed"].join(" ")}
                            </p>
                        </li>
                        <li>
                            <p>
                                {[correctWeapon.knockback, "knockback"].join(
                                    " "
                                )}
                            </p>
                        </li>
                        {#if correctWeapon.material}
                            <li>
                                <p>Material</p>
                            </li>
                        {/if}

                        {#if correctWeapon.tooltip != undefined}
                            {#each correctWeapon.tooltip as tooltip}
                                <li>
                                    <p>{tooltip}</p>
                                </li>
                            {/each}
                        {/if}
                    </ul>
                </div>
            </div>
        {/if}

        {#if submittedWeapons.length == 0}
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
