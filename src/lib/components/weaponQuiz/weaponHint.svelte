<script lang="ts">
    export let weaponHintData: object;

    import { onMount } from "svelte";

    let hintsToShow: boolean[] = [false, false, false];

    $: hint1 = 3 - weaponHintData.submittedWeapons.length > 0 && !weaponHintData.gameFinished;
    $: hint2 = 7 - weaponHintData.submittedWeapons.length > 0 && !weaponHintData.gameFinished;
    $: hint3 = 11 - weaponHintData.submittedWeapons.length > 0 && !weaponHintData.gameFinished;

    const handleHints = (hint: number) => {
        if (hintsToShow[hint]) {
            hintsToShow[hint] = false;
        } else {
            for (let i = 0; i < hintsToShow.length; i++) {
                hintsToShow[i] = false;
            }
            hintsToShow[hint] = true;
        }
    };

    onMount(() => {
        hint1 = 3 - weaponHintData.submittedWeapons.length > 0 && !weaponHintData.gameFinished;
        hint2 = 8 - weaponHintData.submittedWeapons.length > 0 && !weaponHintData.gameFinished;
        hint3 = 15 - weaponHintData.submittedWeapons.length > 0 && !weaponHintData.gameFinished;
    })
</script>

<main>
    <div class="w-full flex gap-2 mb-2">
        <button
            disabled={hint1}
            class="w-full h-fit {hint1
                ? 'cursor-default'
                : ''}"
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
                        in {3 - weaponHintData.submittedWeapons.length} tries...
                    {:else if !hintsToShow[0]}
                        click to reveal
                    {/if}
                </p>
            </div>
        </button>
        <button
            disabled={hint2}
            class="w-full h-fit {hint2
                ? 'cursor-default'
                : ''}"
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
                        in {7 - weaponHintData.submittedWeapons.length} tries...
                    {:else if !hintsToShow[1]}
                        click to reveal
                    {/if}
                </p>
            </div>
        </button>
        <button
            disabled={hint3}
            class="w-full h-fit {hint3
                ? 'cursor-default'
                : ''}"
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
                        in {11 - weaponHintData.submittedWeapons.length} tries...
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
                class="w-full {weaponHintData.correctWeapon.sell
                    .toLowerCase()
                    .split(' ')
                    .includes('gold')
                    ? 'text-[#C1AD4F]'
                    : weaponHintData.correctWeapon.sell
                            .toLowerCase()
                            .split(' ')
                            .includes('silver')
                      ? 'text-[#A0AEAE]'
                      : 'text-[#AB6156]'}"
            >
                {"Sell price: " +
                    weaponHintData.correctWeapon.sell
                        ?.replace("Coins", "")
                        .replace("Coin", "")
                        .toLowerCase()}
            </p>
        {:else if hintsToShow[1]}
            <p class="w-full">
                {#if weaponHintData.correctWeapon.tooltip}
                    {weaponHintData.correctWeapon.tooltip
                        ?.join("\n")
                        .replace(/(?<=\w{2})[^\s!%&'",.?]/g, "-")}
                {:else}
                    There is no tooltip for this item.
                {/if}
            </p>
        {:else if hintsToShow[2]}
            <img
                class="w-16 h-16 mx-auto object-contain blur-sm"
                src={"/images/weapons/" + weaponHintData.correctWeapon.id + ".png"}
                alt="weapon image hint"
            />
        {/if}
    </div>
</main>