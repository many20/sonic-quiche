loopAsync("loop1", async (p) => {

    //print("d")

    sample("drum_bass_soft", {
        finish: 0.1
    });

    await delay(500);

    sample("drum_bass_hard", {
        finish: 0.1
    });

    await delay(500);
});


/*
loopAsync("loop2", async () => {

    print("e")

    sample("drum_bass_soft", {
        finish: 0.5
    });

    await delay(1000)

    sample("drum_bass_hard", {
        finish: 0.5
    });

    await delay(1000)
});
*/