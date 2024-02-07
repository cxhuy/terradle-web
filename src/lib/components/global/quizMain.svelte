<script lang="ts">
    export let quizMainData: Object;
    import { PUBLIC_APIPATH } from "$env/static/public";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let searchInput: HTMLInputElement;
    let inputValue: string = "";
    let filteredElements: any[] = [];
    let filteredElementsOpen: boolean = false;
    let elementClicked: boolean = false;

    const handleFilteredElementsOpen = () => {
        filteredElementsOpen = true;
        document.body.addEventListener("click", handleFilteredElementsClose);
    };

    const handleFilteredElementsClose = () => {
        filteredElementsOpen = false;
        document.body.removeEventListener("click", handleFilteredElementsClose);
    };

    const filterElements = () => {
        handleFilteredElementsOpen();
        elementClicked = false;
        let storageArr: any[] = [];
        if (inputValue) {
            for (var i = 0; i < quizMainData.data[quizMainData.quizType + "s"].length; i++) {
                let element = quizMainData.data[quizMainData.quizType + "s"][i];
                if (
                    element.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) &&
                    storageArr.indexOf(element) == -1 &&
                    quizMainData.submittedElements.indexOf(element) == -1
                ) {
                    storageArr = [...storageArr, element];
                }
            }
        }
        filteredElements = storageArr;
    };

    const setInputVal = (elementName: string) => {
        elementClicked = true;
        inputValue = elementName;
        filteredElements = [];
        document.querySelector("#element-input")?.focus();
    };

    $: if (!inputValue) {
        filteredElements = [];
    }

    const submitValue = () => {
        if (
            inputValue &&
            quizMainData.elementNames.includes(inputValue) &&
            quizMainData.submittedElements.indexOf(
                quizMainData.data[quizMainData.quizType + "s"][
                    quizMainData.elementNames.indexOf(inputValue)
                ]
            )
        ) {
            if (
                quizMainData.submittedElements.length == 0 &&
                inputValue != quizMainData.answer.name
            ) {
                reportResult(0);
            }
            dispatch("submit", { inputValue: inputValue });
            if (inputValue == quizMainData.answer.name) {
                reportResult(1);
                alert(
                    "You Win!\nYou guessed today's " + quizMainData.quizType + " in " +
                        (quizMainData.submittedElements.length + 1).toString() +
                        ((quizMainData.submittedElements.length + 1) == 1
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
        <p class="mx-auto text-2xl">Guess today's {quizMainData.quizType}!</p>
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
                            id="element-input"
                            class="w-full h-9 bg-[#2C3A74] border-[1.5px] border-[#4157A4] rounded-lg text-xl p-2"
                            type="text"
                            placeholder="Type any {quizMainData.quizType} to begin..."
                            bind:this={searchInput}
                            bind:value={inputValue}
                            on:input|stopPropagation={filterElements}
                        />
                        <button on:click|preventDefault={submitValue}>
                            <img
                                class="transition ease-in-out hover:brightness-125 duration-300 w-12 h-9 bg-[#2C3A74] border-[1.5px] border-[#4157A4] rounded-lg object-fill"
                                src="/images/playbutton.png"
                                alt="submit button"
                            />
                        </button>
                    </div>

                    {#if filteredElements.length > 0 && filteredElementsOpen}
                        <ul
                            class="mt-4 mx-auto w-80 max-h-56 h-fit bg-[#2C3A74] border-[1.5px] border-black rounded-xl absolute left-1/2 translate-x-[-50%] overflow-y-auto"
                        >
                            {#each filteredElements as element, i}
                                <li
                                    class="py-2 pl-3 flex items-center cursor-pointer hover:border-[2px] hover:border-sky-200 hover:rounded-xl w-full"
                                    on:click={() => setInputVal(element.name)}
                                >
                                    <img
                                        class="mr-4 w-8 h-8 object-contain"
                                        src={"/images/" + quizMainData.quizType + "s/" +
                                            element.id +
                                            ".png"}
                                        alt={element.name}
                                    />
                                    <p>{element.name}</p>
                                </li>
                            {/each}
                        </ul>
                    {:else if inputValue != "" && !elementClicked && filteredElementsOpen}
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
