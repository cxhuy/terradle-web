<script lang="ts">
    import { onMount } from "svelte";
    import Footer from "$lib/components/global/footer.svelte";
    import HowToPlay from "$lib/components/weaponQuiz/howToPlay.svelte";
    import GameResult from "$lib/components/weaponQuiz/gameResult.svelte";
    import QuizMain from "$lib/components/global/quizMain.svelte";
    import GameStartInfo from "$lib/components/global/gameStartInfo.svelte";
    import SubmittedList from "$lib/components/weaponQuiz/submittedList.svelte";
    import WeaponHint from "$lib/components/weaponQuiz/weaponHint.svelte";
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
        localStorage.setItem(
            "submittedWeapons",
            JSON.stringify(submittedWeaponsName)
        );
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

    let gameStartInfoData = {
        successCount: data.initialData.successCount,
        quizType: "weapon",
        yesterday: yesterdayWeapon,
        color: rarityColors[parseInt(yesterdayWeapon.rarity)].toLowerCase(),
    };

    $: submittedListData = {
        submittedWeapons: submittedWeapons,
        correctWeapon: correctWeapon,
    };

    $: weaponHintData = {
        submittedWeapons: submittedWeapons,
        correctWeapon: correctWeapon,
        gameFinished: gameFinished,
    };
</script>

{#if syncedLocalStorage}
    <main class="-translate-y-4">
        <QuizMain {quizMainData} on:submit={submitWeapon}>
            <div slot="hints">
                <WeaponHint {weaponHintData} />
            </div>
        </QuizMain>

        {#if gameFinished}
            <GameResult {gameResultData} />
        {/if}

        {#if submittedWeapons.length == 0}
            <GameStartInfo {gameStartInfoData} />
        {:else}
            <SubmittedList {submittedListData} />
        {/if}
        <HowToPlay />
        <Footer />
    </main>
{/if}
