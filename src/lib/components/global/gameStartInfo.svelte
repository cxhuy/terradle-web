<script>
    export let gameStartInfoData;
</script>

<p class="mt-1 text-center">
    {gameStartInfoData.successCount} people have guessed today's {gameStartInfoData.quizType}!
</p>
<div class="mt-6 flex flex-col justify-center items-center text-xl">
    <p>Yesterday's {gameStartInfoData.quizType} was...</p>
    <img
        style="border-color: {gameStartInfoData.color};"
        class="mt-2 p-2 w-16 h-16 ml-1 bg-black/60 object-contain roudned-lg border-2"
        src={"/images/" + gameStartInfoData.quizType + "s/" + gameStartInfoData.yesterday.id + ".png"}
        alt={gameStartInfoData.yesterday.name}
    />
    <p
        style="color: {gameStartInfoData.color};"
        class="mt-1"
    >
        {gameStartInfoData.yesterday.name}
    </p>
</div>