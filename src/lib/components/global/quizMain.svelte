<script lang="ts">
    export let quizMainData: Object;
    import { PUBLIC_APIPATH } from "$env/static/public";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let searchInput: HTMLInputElement;
    let inputValue: string = "";
    let filteredWeapons: any[] = [];
    let filteredWeaponsOpen: boolean = false;
    let weaponClicked: boolean = false;

    const handleFilteredWeaponsOpen = () => {
        filteredWeaponsOpen = true;
        document.body.addEventListener("click", handleFilteredWeaponsClose);
    };

    const handleFilteredWeaponsClose = () => {
        filteredWeaponsOpen = false;
        document.body.removeEventListener("click", handleFilteredWeaponsClose);
    };

    const filterWeapons = () => {
        handleFilteredWeaponsOpen();
        weaponClicked = false;
        let storageArr: any[] = [];
        if (inputValue) {
            for (var i = 0; i < quizMainData.data.weapons.length; i++) {
                let weapon = quizMainData.data.weapons[i];
                if (
                    weapon.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) &&
                    storageArr.indexOf(weapon) == -1 &&
                    quizMainData.submittedWeapons.indexOf(weapon) == -1
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

    $: if (!inputValue) {
        filteredWeapons = [];
    }

    const submitValue = () => {
        if (
            inputValue &&
            quizMainData.weaponNames.includes(inputValue) &&
            quizMainData.submittedWeapons.indexOf(
                quizMainData.data.weapons[
                    quizMainData.weaponNames.indexOf(inputValue)
                ]
            )
        ) {
            if (
                quizMainData.submittedWeapons.length == 0 &&
                inputValue != quizMainData.correctWeapon.name
            ) {
                reportResult(0);
            }
            dispatch("submit", { inputValue: inputValue });
            if (inputValue == quizMainData.correctWeapon.name) {
                reportResult(1);
                alert(
                    "You Win!\nYou guessed today's weapon in " +
                        quizMainData.submittedWeapons.length.toString() +
                        (quizMainData.submittedWeapons.length == 1
                            ? " try!"
                            : " tries!")
                );
            }
            inputValue = "";
        }
    };

    async function reportResult(success: number) {
        const response = await fetch(
            PUBLIC_APIPATH +
                "reportResult.php?date=" +
                quizMainData.data.initialData.date +
                "&success=" +
                success.toString() +
                "&token=" +
                encodeURIComponent(localStorage.getItem("token"))
        );
        localStorage.setItem("rank", (await response.json()).rank);
    }
</script>

<div>
    <div
        class="mx-auto translate-y-1/2 w-64 h-14 bg-[#495EAB] border-[1.5px] border-black rounded-3xl flex items-center"
    >
        <p class="mx-auto text-2xl">Guess today's weapon!</p>
    </div>
    <div
        class="mx-auto w-80 h-fit bg-[#1C2443]/95 border-[1.5px] border-black rounded-xl flex flex-col pt-8 px-2"
    >
        <slot name="hints" />
        {#if !quizMainData.gameFinished}
            <div class="w-full mb-2">
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
                                    on:click={() => setInputVal(weapon.name)}
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
