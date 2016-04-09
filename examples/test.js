loop("loop1", function* () {
    //print("d")

    sample("drum_bass_soft", {
        finish: 0.1
    });

    yield delay(500);

    sample("drum_bass_hard", {
        finish: 0.1
    });

    yield delay(500);
});

/*
loop("loop2", function* () {
    //print("d")

    sample("drum_bass_soft", {
        finish: 0.5
    });

    yield delay(1000);

    sample("drum_bass_hard", {
        finish: 0.5
    });

    yield delay(1000);
});
*/