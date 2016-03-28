sonic-quiche for JavaScript
============

Web Audio API implementation of Sonic Pi


This project tries to translate Ruby code to js, but in js there is no wait() Function and also without wait you can´t sync threads the way sonic pi does it. But the ideas for this project are nice and I want to test if the browser worker api has problems to do timing critical jobs.

I dropped the ruby-to-js thing and translated parts of the api to js and with help q.js I programmed an asyc wait.

example:

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


TODO:

- translate the complete api.js file
- a sync or prioritisation mechanism between loops is needed, because of the delay from the worker messageing
