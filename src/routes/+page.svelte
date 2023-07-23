<script lang="ts">
    export let data;

    let filteredWeapons: any[] = [];
    let weaponClicked: boolean = false;

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

    let correctWeapon =
        data.weapons[Math.floor(Math.random() * data.weapons.length)];
    console.log(correctWeapon);
    let submittedWeapons: any[] = [];

    const submitValue = () => {
        if (
            inputValue &&
            weaponNames.includes(inputValue) &&
            submittedWeapons.indexOf(
                data.weapons[weaponNames.indexOf(inputValue)]
            )
        ) {
            submittedWeapons = [
                data.weapons[weaponNames.indexOf(inputValue)],
                ...submittedWeapons,
            ];
            if (inputValue == correctWeapon.name) {
                alert("You Win!");
            }
            inputValue = "";
        }
    };
</script>

<main class="-translate-y-4">
    <div>
        <div
            class="mx-auto translate-y-1/2 w-64 h-14 bg-[#495EAB] border-[1.5px] border-black rounded-3xl flex items-center"
        >
            <p class="mx-auto text-2xl">Guess today's weapon!</p>
        </div>
        <div
            class="mx-auto w-80 h-fit bg-[#1C2443] border-[1.5px] border-black rounded-xl flex flex-col pt-8 px-2 pb-2"
        >
            <div class="w-full flex gap-2 mb-2">
                <button class="w-full h-fit {5 - submittedWeapons.length > 0 ? 'disabled cursor-default' : ''}">
                    <div
                        class="w-full h-fit {5 - submittedWeapons.length > 0 ? 'bg-[#2C3A74]/50 border-black' : 'bg-[#2C3A74]'} border-[1.5px] rounded-lg text-xs text-center flex flex-col py-1 px-2"
                    >
                        <img
                            class="my-1 h-8 object-contain"
                            src="src/lib/images/weapons_hint/selling_price_hint.png"
                            alt="gold coin"
                        />
                        <p class="mx-auto">Selling price</p>
                        <p>
                            {#if 5 - submittedWeapons.length > 0}
                                in {5 - submittedWeapons.length} tries...
                            {:else}
                                click to reveal
                            {/if}
                        </p>
                    </div>
                </button>
                <button class="w-full h-fit {10 - submittedWeapons.length > 0 ? 'disabled cursor-default' : ''}">
                    <div
                        class="w-full h-fit {10 - submittedWeapons.length > 0 ? 'bg-[#2C3A74]/50 border-black' : 'bg-[#2C3A74]'} border-[1.5px] rounded-lg text-xs text-center flex flex-col py-1 px-2"
                    >
                        <img
                            class="my-1 h-8 object-contain"
                            src="src/lib/images/weapons_hint/tooltip_hint.png"
                            alt="gold coin"
                        />
                        <p class="mx-auto">Tooltip</p>
                        <p class="mx-auto">
                            {#if 10 - submittedWeapons.length > 0}
                                in {10 - submittedWeapons.length} tries...
                            {:else}
                                click to reveal
                            {/if}
                        </p>
                    </div>
                </button>
                <button class="w-full h-fit {15 - submittedWeapons.length > 0 ? 'disabled cursor-default' : ''}">
                    <div
                        class="w-full h-fit {15 - submittedWeapons.length > 0 ? 'bg-[#2C3A74]/50 border-black' : 'bg-[#2C3A74]'} border-[1.5px] rounded-lg text-xs text-center flex flex-col py-1 px-2"
                    >
                        <img
                            class="my-1 h-8 object-contain"
                            src="src/lib/images/weapons_hint/image_hint.png"
                            alt="gold coin"
                        />
                        <p class="mx-auto">Image</p>
                        <p class="mx-auto">
                            {#if 15 - submittedWeapons.length > 0}
                                in {15 - submittedWeapons.length} tries...
                            {:else}
                                click to reveal
                            {/if}
                        </p>
                    </div>
                </button>
            </div>
            <div class="w-full">
                <form autocomplete="off" on:submit|preventDefault={submitValue}>
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
                                class="w-12 h-9 bg-[#2C3A74] border-[1.5px] border-[#4157A4] rounded-lg object-fill"
                                src="src/lib/images/playbutton.png"
                                alt=""
                            />
                        </button>
                    </div>

                    {#if filteredWeapons.length > 0 && filteredWeaponsOpen}
                        <ul
                            class="mt-4 mx-auto w-80 max-h-56 h-fit bg-[#2C3A74] border-[1.5px] border-black rounded-xl absolute left-1/2 translate-x-[-50%] overflow-y-scroll"
                        >
                            {#each filteredWeapons as weapon, i}
                                <li
                                    class="py-2 pl-3 flex items-center cursor-pointer hover:border-[2px] hover:border-sky-200 hover:rounded-xl w-full"
                                    on:click={() => setInputVal(weapon.name)}
                                >
                                    <img
                                        class="mr-4 w-8 h-8 object-contain"
                                        src={"src/lib/images/weapons/" +
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
                            class="mt-4 mx-auto w-80 max-h-56 h-fit border-[1.5px] border-black rounded-xl absolute left-1/2 translate-x-[-50%] overflow-y-scroll"
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
        </div>
    </div>

    {#if submittedWeapons.length}
        <div
            class="mt-4 mx-auto w-fit bg-black/60 flex gap-1 justify-center items-center text-center"
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
    {/if}

    <ul>
        {#each submittedWeapons as weapon}
            <li class="mt-4 flex gap-1 justify-center items-center">
                <div
                    class="w-20 h-16 bg-black/50 border-2 border-black flex items-center text-center"
                >
                    <img
                        class="w-12 h-8 mx-auto object-contain"
                        src={"src/lib/images/weapons/" + weapon.id + ".png"}
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
                    class="w-20 h-16 {weapon.damage == correctWeapon.damage
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
                    class="w-20 h-16 {weapon.speed == correctWeapon.speed
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
                    class="w-20 h-16 {weapon.rarity == correctWeapon.rarity
                        ? 'bg-green-500'
                        : 'bg-red-500'} border-2 border-black flex items-center text-center"
                >
                    <div class="flex items-center mx-auto">
                        <img
                            class="w-14 max-h-4 object-contain"
                            src={"src/lib/images/rarity/" +
                                weapon.rarity +
                                ".png"}
                            alt=""
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
                        <p>{weapon.autoswing ? "O" : "X"}</p>
                    </div>
                </div>
                <div
                    class="w-20 h-16 {weapon.material == correctWeapon.material
                        ? 'bg-green-500'
                        : 'bg-red-500'} border-2 border-black flex items-center text-center"
                >
                    <div class="flex items-center mx-auto">
                        <p>{weapon.material ? "O" : "X"}</p>
                    </div>
                </div>
                <div
                    class="w-20 h-16 {weapon.obtained.join(' ') ==
                    correctWeapon.obtained.join(' ')
                        ? 'bg-green-500'
                        : 'bg-red-500'} border-2 border-black flex items-center text-center"
                >
                    <div class="flex items-center mx-auto">
                        <div class="flex flex-col">
                            {#each weapon.obtained as obtained}
                                <p>{obtained}</p>
                            {/each}
                        </div>
                    </div>
                </div>
            </li>
        {/each}
    </ul>
</main>

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
