loop("loop1", (p) => {
    return p
        .then(() => {

            //print("d")

            sample("drum_bass_soft", {
                finish: 0.1
            });

        })
        .delay(500)
        .then(() => {

            sample("drum_bass_hard", {
                finish: 0.1
            });

        })
        .delay(500)
});



loop("loop2", (p) => {
    return p
        .then(() => {

            //print("d")

            sample("drum_bass_soft", {
                finish: 0.5
            });

        })
        .delay(1000)
        .then(() => {

            sample("drum_bass_hard", {
                finish: 0.5
            });

        })
        .delay(1000)
});