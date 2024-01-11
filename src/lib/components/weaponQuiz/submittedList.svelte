<script lang="ts">
    export let submittedListData: Object;

    import { fade } from "svelte/transition";

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

    const haveOverlappingElements = (arr1: any[], arr2: any[]) => {
        for (let i = 0; i < arr1.length; i++) {
            if (arr2.includes(arr1[i])) {
                return true;
            }
        }
        return false;
    };
</script>

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
        {#each submittedListData.submittedWeapons as weapon (weapon.id)}
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
                    submittedListData.correctWeapon.damageType
                        ? 'bg-green-500'
                        : 'bg-red-500'} border-2 border-black flex items-center text-center"
                >
                    <div class="flex items-center mx-auto">
                        <p>{weapon.damageType}</p>
                    </div>
                </div>
                <div
                    class="w-20 h-16 {weapon.damage ==
                    submittedListData.correctWeapon.damage
                        ? 'bg-green-500'
                        : 'bg-red-500'} border-2 border-black flex items-center text-center"
                >
                    <div class="flex items-center mx-auto">
                        <p class="w-14">{weapon.damage}</p>
                        {#if parseInt(weapon.damage) < parseInt(submittedListData.correctWeapon.damage)}
                            <p>↑</p>
                        {:else if parseInt(weapon.damage) > parseInt(submittedListData.correctWeapon.damage)}
                            <p>↓</p>
                        {/if}
                    </div>
                </div>
                <div
                    class="w-20 h-16 {weapon.knockback ==
                    submittedListData.correctWeapon.knockback
                        ? 'bg-green-500'
                        : 'bg-red-500'} border-2 border-black flex items-center text-center"
                >
                    <div class="flex items-center mx-auto">
                        <p class="w-14">{weapon.knockback}</p>
                        {#if knockbacks.indexOf(weapon.knockback) < knockbacks.indexOf(submittedListData.correctWeapon.knockback)}
                            <p>↑</p>
                        {:else if knockbacks.indexOf(weapon.knockback) > knockbacks.indexOf(submittedListData.correctWeapon.knockback)}
                            <p>↓</p>
                        {/if}
                    </div>
                </div>
                <div
                    class="w-20 h-16 {weapon.speed ==
                    submittedListData.correctWeapon.speed
                        ? 'bg-green-500'
                        : 'bg-red-500'} border-2 border-black flex items-center text-center"
                >
                    <div class="flex items-center mx-auto">
                        <p class="w-14">{weapon.speed}</p>
                        {#if speeds.indexOf(weapon.speed) > speeds.indexOf(submittedListData.correctWeapon.speed)}
                            <p>↑</p>
                        {:else if speeds.indexOf(weapon.speed) < speeds.indexOf(submittedListData.correctWeapon.speed)}
                            <p>↓</p>
                        {/if}
                    </div>
                </div>
                <div
                    class="w-20 h-16 {weapon.rarity ==
                    submittedListData.correctWeapon.rarity
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
                        {#if parseInt(weapon.rarity) < parseInt(submittedListData.correctWeapon.rarity)}
                            <p>↑</p>
                        {:else if parseInt(weapon.rarity) > parseInt(submittedListData.correctWeapon.rarity)}
                            <p>↓</p>
                        {/if}
                    </div>
                </div>
                <div
                    class="w-20 h-16 {weapon.autoswing ==
                    submittedListData.correctWeapon.autoswing
                        ? 'bg-green-500'
                        : 'bg-red-500'} border-2 border-black flex items-center text-center"
                >
                    <div class="flex items-center mx-auto">
                        <p>{weapon.autoswing ? "Yes" : "No"}</p>
                    </div>
                </div>
                <div
                    class="w-20 h-16 {weapon.material ==
                    submittedListData.correctWeapon.material
                        ? 'bg-green-500'
                        : 'bg-red-500'} border-2 border-black flex items-center text-center"
                >
                    <div class="flex items-center mx-auto">
                        <p>{weapon.material ? "Yes" : "No"}</p>
                    </div>
                </div>
                {#if weapon.obtained.join(" ") == submittedListData.correctWeapon.obtained.join(" ")}
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
                {:else if haveOverlappingElements(weapon.obtained, submittedListData.correctWeapon.obtained)}
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
                {:else if weapon.obtained.join(" ") != submittedListData.correctWeapon.obtained.join(" ")}
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