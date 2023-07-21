<script lang="ts">
    export let data;

    let filteredWeapons: any[] = [];

    const filterWeapons = () => {
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
                <input
                    class="w-full h-9 bg-[#2C3A74] border-[1.5px] border-[#4157A4] rounded-lg text-xl p-2"
                    type="text"
                    placeholder="Type any weapon to begin..."
                    bind:this={searchInput}
                    bind:value={inputValue}
                    on:input={filterWeapons}
                />
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
        text-align: center;
    }
</style>
