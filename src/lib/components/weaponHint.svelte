<script>
    export let weaponHintData;

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    const handleHints = (hint) => {
        dispatch("handleHints", {
            hint: hint,
        });
    };
</script>

<main>
    <div class="w-full flex gap-2 mb-2">
        <button
            disabled={weaponHintData.hints[0]}
            class="w-full h-fit {weaponHintData.hints[0]
                ? 'cursor-default'
                : ''}"
            on:click={() => handleHints(0)}
        >
            <div
                class="w-full h-fit {weaponHintData.hints[0]
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
                    {#if weaponHintData.hints[0]}
                        in {3 - weaponHintData.submittedWeaponsLength} tries...
                    {:else if !weaponHintData.hintsToShow[0]}
                        click to reveal
                    {/if}
                </p>
            </div>
        </button>
        <button
            disabled={weaponHintData.hints[1]}
            class="w-full h-fit {weaponHintData.hints[1]
                ? 'cursor-default'
                : ''}"
            on:click={() => handleHints(1)}
        >
            <div
                class="w-full h-fit {weaponHintData.hints[1]
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
                    {#if weaponHintData.hints[1]}
                        in {7 - weaponHintData.submittedWeaponsLength} tries...
                    {:else if !weaponHintData.hintsToShow[1]}
                        click to reveal
                    {/if}
                </p>
            </div>
        </button>
        <button
            disabled={weaponHintData.hints[2]}
            class="w-full h-fit {weaponHintData.hints[2]
                ? 'cursor-default'
                : ''}"
            on:click={() => handleHints(2)}
        >
            <div
                class="w-full h-fit {weaponHintData.hints[2]
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
                    {#if weaponHintData.hints[2]}
                        in {11 - weaponHintData.submittedWeaponsLength} tries...
                    {:else if !weaponHintData.hintsToShow[2]}
                        click to reveal
                    {/if}
                </p>
            </div>
        </button>
    </div>
    <div
        class="{!weaponHintData.hintsToShow.includes(true)
            ? 'hidden'
            : ''} w-full h-fit p-2 mb-2 bg-[#2C3A74] rounded-lg flex items-center text-center"
    >
        {#if weaponHintData.hintsToShow[0]}
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
        {:else if weaponHintData.hintsToShow[1]}
            <p class="w-full">
                {#if weaponHintData.correctWeapon.tooltip}
                    {weaponHintData.correctWeapon.tooltip
                        ?.join("\n")
                        .replace(/(?<=\w{2})[^\s!%&'",.?]/g, "-")}
                {:else}
                    There is no tooltip for this item.
                {/if}
            </p>
        {:else if weaponHintData.hintsToShow[2]}
            <img
                class="w-16 h-16 mx-auto object-contain blur-sm"
                src={"/images/weapons/" + weaponHintData.correctWeapon.id + ".png"}
                alt="weapon image hint"
            />
        {/if}
    </div>
</main>