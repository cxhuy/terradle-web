<main class="-translate-y-4">
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
                class="w-full h-20 bg-[#2C3A74] border-[1.5px] border-black rounded-lg"
            />
            <div
                class="w-full h-20 bg-[#2C3A74] border-[1.5px] border-black rounded-lg"
            />
            <div
                class="w-full h-20 bg-[#2C3A74] border-[1.5px] border-black rounded-lg"
            />
        </div>
        <div class="w-full">
            <input
                class="w-full h-9 bg-[#2C3A74] border-[1.5px] border-[#4157A4] rounded-lg"
                type="text"
                placeholder="Type any weapon to begin..."
            />
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
