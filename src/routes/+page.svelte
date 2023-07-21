<script lang="ts">
    export let data;

    let filteredWeapons: any[] = [];
    let weaponClicked: boolean = false;

    const filterWeapons = () => {
        weaponClicked = false;
        let storageArr: any[] = [];
        if (inputValue) {
            for (var i = 0; i < data.weapons.length; i++) {
                let weapon = data.weapons[i];
                if (
                    weapon.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) &&
                    storageArr.indexOf(weapon) == -1
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
                <div
                    class="w-full h-fit bg-[#2C3A74] border-[1.5px] border-black rounded-lg text-xs text-center flex flex-col py-1 px-2"
                >
                    <img
                        class="my-1 h-8 object-contain"
                        src="src/lib/images/weapons_hint/selling_price_hint.png"
                        alt="gold coin"
                    />
                    <p class="mx-auto">Selling price</p>
                    <p class="mx-auto">in 5 tries...</p>
                </div>
                <div
                    class="w-full h-fit bg-[#2C3A74] border-[1.5px] border-black rounded-lg text-xs text-center flex flex-col py-1 px-2"
                >
                    <img
                        class="my-1 h-8 object-contain"
                        src="src/lib/images/weapons_hint/tooltip_hint.png"
                        alt="gold coin"
                    />
                    <p class="mx-auto">Tooltip</p>
                    <p class="mx-auto">in 10 tries...</p>
                </div>
                <div
                    class="w-full h-fit bg-[#2C3A74] border-[1.5px] border-black rounded-lg text-xs text-center flex flex-col py-1 px-2"
                >
                    <img
                        class="my-1 h-8 object-contain"
                        src="src/lib/images/weapons_hint/image_hint.png"
                        alt="gold coin"
                    />
                    <p class="mx-auto">Image</p>
                    <p class="mx-auto">in 15 tries...</p>
                </div>
            </div>
            <div class="w-full">
                <form autocomplete="off" on:submit|preventDefault={null}>
                    <div class="flex">
                        <input
                            id="weapon-input"
                            class="w-full h-9 bg-[#2C3A74] border-[1.5px] border-[#4157A4] rounded-lg text-xl p-2"
                            type="text"
                            placeholder="Type any weapon to begin..."
                            bind:this={searchInput}
                            bind:value={inputValue}
                            on:input={filterWeapons}
                        />
                        <button on:click|preventDefault={null}>
                            <img
                                class="ml-1 w-9 h-9 bg-[#2C3A74] border-[1.5px] border-[#4157A4] rounded-lg object-fill"
                                src="src/lib/images/playbutton.png"
                                alt=""
                            />
                        </button>
                    </div>

                    {#if filteredWeapons.length > 0}
                        <ul
                            class="mt-4 mx-auto w-80 max-h-56 h-fit border-[1.5px] border-black rounded-xl absolute left-1/2 translate-x-[-50%] overflow-y-scroll"
                        >
                            {#each filteredWeapons as weapon, i}
                                <li
                                    class="py-2 pl-3 flex items-center cursor-pointer bg-[#2C3A74] hover:border-[2px] hover:border-sky-200 w-full"
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
                    {:else if inputValue != "" && !weaponClicked}
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
