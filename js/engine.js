function SQEngine() {
    var _worker_template = null;
    var _workers = {};
    var _code = "";

    function handleEvent(event) {
        switch (event.action) {
        case "complete":
            delete _workers[event.thread_id];

            if ($.isEmptyObject(_workers)) {
                EventBus.fire("complete");
            }
            break;

        case "worker":
            var newThreadId = event.data;
            if (!(newThreadId in _workers)) {
                startWorker(newThreadId);
            }
            break;

        case "log":
        case "warn":
        case "error":
            EventBus.fire(event.action, event.data);
            break;

        default:
            EventBus.fire(event.action, {
                thread_id: event.thread_id,
                data: event.data
            });
        }
    }

    function startWorker(id) {
        var codeBlob = new Blob([_code], {
            type: "application/javascript"
        });
        _workers[id] = new Worker(URL.createObjectURL(codeBlob));
        _workers[id].onmessage = function (e) {
            handleEvent(e.data);
        };
        _workers[id].postMessage({
            thread_id: id
        });
    }

    function play(newCode) {
        stop();

        if (_worker_template == null) {
            EventBus.fire("log", "Cannot compile - haven't finished downloading api.rb yet");
        } else {
            EventBus.fire("log", "Compiling script");

            var rawWorkerCode = _worker_template.replace("[[code_body]]", newCode);
            _code = rawWorkerCode;

            EventBus.fire("log", "Running script");
            EventBus.fire("playing", {});

            startWorker(0);
        }
    }

    function stop() {
        $.each(_workers, function (_, worker) {
            worker.terminate();
        });

        _workers = {};

        EventBus.fire("stopped", {});
    }

    $.get("api.js", function (code) {
        _worker_template = code;
    });

    EventBus.on("play", function (code) {
        play(code);
    });
    EventBus.on("stop", function (_) {
        stop();
    });

    return {
        "play": play,
        "stop": stop
    };
}