//importScripts("https://cdnjs.cloudflare.com/ajax/libs/q.js/2.0.3/q.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/q.js/1.4.1/q.min.js");

//# Aggregated and modified Sonic Pi API. Original license stated below.
//#--
//# This file is part of Sonic Pi: http://sonic-pi.net
//# Full project source: https://github.com/samaaron/sonic-pi
//# License: https://github.com/samaaron/sonic-pi/blob/master/LICENSE.md
//#
//# Copyright 2013, 2014 by Sam Aaron (http://sam.aaron.name).
//# All rights reserved.
//#
//# Permission is granted for use, copying, modification, distribution,
//# and distribution of modified versions of this work as long as this
//# notice is included.
//#++

/**
 * is value undefined?
 * Note that this doesn't quite work for object properties
 * http://www.quora.com/What-is-the-best-way-to-check-if-a-property-or-variable-is-undefined
 *
 * @param {*} value
 */
function isUndefined(value) {
    return typeof value === 'undefined';
}

/**
 * is value usable?
 * @param {*} value
 * @return {boolean}
 */
function isUsable(value) {
    return (typeof value === 'undefined') !== true && value !== null;
}

/**
 * is value an array?
 * @param {*} value
 * @return {boolean}
 */
function isArray(value) {
    return isUsable(value) && Array.isArray(value); //(value instanceof Array)
}

/**
 * is value an Object?
 * @param {*} value
 * @return {boolean}
 */
function isObject(val) {
    return isUsable(value) && ((typeof val === 'function') || (typeof val === 'object'));
}

/**
 * test if condition is true -> if not throw an exeption
 * @param {boolean} condition
 * @param {string} message
 */
function assert(condition, message) {
    if (!condition) throw new Error(message || "Assertion failed");
}

var _reserved = {
    thread_id: 0,
    current_thread: 0,
    next_node_id: 0,
    sleep_mul: 0.5, // 120 BPM,
    transpose: 0,
    synth: "square",
    send: function (action, data) {
        if (action == "complete" || _reserved.current_thread == _reserved.thread_id) {
            postMessage({
                action: action,
                data: data,
                thread_id: _reserved.thread_id
            });
        }
    }
};

//def resolve_synth_opts_hash_or_array(opts)
//case opts
//when Hash
//return opts
//when Array
//s = opts.size
//return Hash[ * opts]
//if s.even ? && s > 1
//case s
//when 1
//case opts[0]
//when Hash
//return opts[0]
//else
//    raise "Invalid options. Options should either be an even list of key value pairs, a single Hash or nil. Got a single value array where the value isn't a Hash"
//end
//when 0
//return {}
//end
//when NilClass
//return {} else
//    raise "Invalid options. Options should either be an even list of key value pairs, a single Hash or nil. Got something completely different"
//end
//end

function print(output) {
    _reserved.send("log", output);
}

function puts(output) {
    print(output);
}

function rrand_i(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function dice(num_sides) {
    num_sides = ifIsUsableOrDefault(num_sides, 6);
    return rrand_i(1, num_sides)
}

function one_in(num) {
    return (rrand_i(1, num) === 1);
}

function rrand(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function rand(max) {
    max = ifIsUsableOrDefault(max, 1);
    return rrand(0, max)
}

function rand_i(max) {
    max = ifIsUsableOrDefault(max, 2);
    return rrand_i(0, max);
}

function choose(list) {
    return list[rand_i(list.length)];
}

// def use_random_seed(seed, & block)
// raise "use_random_seed does not work with a block. Perhaps you meant with_random_seed"
// if block
//
// % x {
//     _reserved.send("warn", "Random number seeding is not supported in web browsers");
// }
// end
//
// def with_random_seed(seed, & block)
// raise "with_random_seed requires a block. Perhaps you meant use_random_seed"
// unless block
// use_random_seed(seed)
// block.call
// end

// def use_bpm(bpm, & block)
// raise "use_bpm does not work with a block. Perhaps you meant with_bpm"
// if block
//
// % x {
//     _reserved.sleep_mul = 60.0 / bpm;
// }
// end
//
// def with_bpm(bpm, & block)
// raise "with_bpm must be called with a block. Perhaps you meant use_bpm"
// unless block
// old_bpm = current_bpm
// use_bpm(bpm)
// block.call
// use_bpm(old_bpm)
// end

function current_bpm() {
    return 60.0 / _reserved.sleep_mul;
}

function rt(t) {
    return t / _reserved.sleep_mul;
}

function sleep(seconds) {
    _reserved.send("cmd", {
        type: "sleep",
        length: (seconds * _reserved.sleep_mul)
    });
}

function sync(cue_id) {
    _reserved.send("sync", cue_id);
}

function cue(cue_id) {
    _reserved.send("cue", cue_id);
}

//function wait(time) {
// if (time.is_a ? Symbol) {
//   sync(time);
// } else {
//   sleep(time);
// }
//}

// def in_thread( * opts, & block) % x {
//     if (_reserved.current_thread + 1 == _reserved.thread_id) {
//         _reserved.current_thread++;
//         block.$call();
//         _reserved.current_thread--;
//     } else {
//         _reserved.send("worker", _reserved.current_thread + 1);
//     }
// }
// end

// def use_arg_bpm_scaling(bool, & block)
// raise "use_arg_bpm_scaling does not work with a block. Perhaps you meant with_arg_bpm_scaling"
// if block
//
// % x {
//     _reserved.arg_bpm_scaling = bool;
// }
// end
//
// def with_arg_bpm_scaling(bool, & block)
// raise "with_arg_bpm_scaling must be called with a block. Perhaps you meant use_arg_bpm_scaling"
// unless block
//
// % x {
//     var oldValue = _reserved.arg_bpm_scaling;
//     _reserved.arg_bpm_scaling = bool;
//     block.$call();
//     _reserved.arg_bpm_scaling = oldValue;
// }
// end

// def midi_to_hz(n)
// n = note(n) unless n.is_a ? Numeric
// 440.0 * (2 * * ((n - 69) / 12.0))
// end
//
function hz_to_midi(freq) {
    return (12 * (Math.log(freq * 0.0022727272727) / Math.log(2))) + 69;
}
//
// def note(n, * args)
// return nil
// if (n.nil ? || n == : r || n == : rest)
//     return Note.resolve_midi_note_without_octave(n) if args.empty ?
// args_h = resolve_synth_opts_hash_or_array(args)
// octave = args_h[: octave]
// if octave
// Note.resolve_midi_note(n, octave)
// else
//     Note.resolve_midi_note_without_octave(n)
// end
// end

// def note_info(n, * args)
// args_h = resolve_synth_opts_hash_or_array(args)
// octave = args_h[: octave]
// Note.new(n, octave)
// end
//
// def degree(degree, tonic, scale)
// Scale.resolve_degree(degree, tonic, scale)
// end
//
// def scale(tonic, name, * opts)
// opts = resolve_synth_opts_hash_or_array(opts)
// opts = {: num_octaves => 1
// }.merge(opts)
// Scale.new(tonic, name, opts[: num_octaves])
// end
//
// def chord(tonic, name = : major, * opts)
// if tonic.is_a ? Array
// raise "List passed as parameter to chord needs two elements i.e. chord([:e3, :minor]), you passed: #{tonic.inspect}"
// unless tonic.size == 2
// Chord.new(tonic[0], tonic[1]).to_a
// else
//     Chord.new(tonic, name).to_a
// end
// end
//
// def set_sched_ahead_time!(t)
// sleep(t)
// end

function current_transpose() {
    return _reserved.transpose;
}

// def use_transpose(shift, & block)
// raise "use_transpose does not work with a do/end block. Perhaps you meant with_transpose"
// if block
// raise "Transpose value must be a number, got #{shift.inspect}"
// unless shift.is_a ? (Numeric)
//
// % x {
//     _reserved.transpose = shift;
// }
// end
//
// def with_transpose(shift, & block)
// raise "with_transpose requires a do/end block. Perhaps you meant use_transpose"
// unless block
// raise "Transpose value must be a number, got #{shift.inspect}"
// unless shift.is_a ? (Numeric)
//
// % x {
//     var oldValue = _reserved.transpose;
//     _reserved.transpose = shift;
//     block.$call();
//     _reserved.transpose = oldValue;
// }
// end

function current_volume() {
    return _reserved.volume;
}


function set_volume(vol) {
    var max_vol = 5;
    var new_vol = 0;
    if (vol > max_vol) {
        new_vol = max_vol
    } else if (vol < 0) {
        new_vol = 0
    } else {
        new_vol = vol
    }
    _reserved.volume = new_vol;
}

function current_synth() {
    return _reserved.synth;
}

// def use_synth(synth, & block)
// raise "use_synth does not work with a do/end block. Perhaps you meant with_synth"
// if block
//
// % x {
//     _reserved.synth = synth;
// }
// end
//
// def with_synth(synth, & block)
// raise "with_synth must be called with a do/end block. Perhaps you meant use_synth"
// unless block
//
// % x {
//     var oldValue = _reserved.synth;
//     _reserved.synth = synth;
//     block.$call();
//     _reserved.synth = oldValue;
// }
// end

function current_synth_defaults() {
    return _reserved.synth_defaults;
}

function use_synth_defaults(args) {
    _reserved.synth_defaults = args;
}

// def use_merged_synth_defaults( * args, & block)
// raise "use_merged_synth_defaults does not work with a block. Perhaps you meant with_merged_synth_defaults"
// if block
// current_defs = current_synth_defaults
// args_h = resolve_synth_opts_hash_or_array(args)
// merged_defs = (current_defs || {}).merge(args_h)
//
// use_synth_defaults(merged_defs)
// end

// def with_synth_defaults( * args, & block)
// raise "with_synth_defaults must be called with a block"
// unless block
// current_defs = current_synth_defaults
//
// args_h = resolve_synth_opts_hash_or_array(args)
// use_synth_defaults(args_h)
// block.call
// use_synth_defaults(current_dfs)
// end
//
// def with_merged_synth_defaults( * args, & block)
// raise "with_merged_synth_defaults must be called with a block"
// unless block
// current_defs = current_synth_defaults
//
// args_h = resolve_synth_opts_hash_or_array(args)
// merged_defs = (current_defs || {}).merge(args_h)
// with_synth_defaults(merged_defs, block)
// end
//
// def recording_start % x {
//     _reserved.send("warn", "Sonic Quiche does not yet support recodings. Sad soup.");
// }
// end
//
// def recording_stop % x {
//     _reserved.send("warn", "Sonic Quiche does not yet support recodings. Sad soup.");
// }
// end

// def recording_save % x {
//     _reserved.send("warn", "Sonic Quiche does not yet support recodings. Sad soup.");
// }
// end
//
// def recording_delete % x {
//     _reserved.send("warn", "Sonic Quiche does not yet support recodings. Sad soup.");
// }
// end

/*function synth(synth, * args) {
    args_h = resolve_synth_opts_hash_or_array(args)
    if args.has_key ? :
        note
    n = args_h[: note]
    n = n.call
    if n.is_a ? Proc
    n = note(n) unless n.is_a ? Numeric
    n += current_transpose
    args_h[: note] = n
    end
    _reserved_trigger_inst synth, args_h
    end
    function play(n, * args) {
        return play_chord(n, * args) if n.is_a ? (Array)
        n = n.call
        if n.is_a ? Proc
        return nil
        if (n.nil ? || n == : r || n == : rest)
            init_args_h = {}
        args_h = resolve_synth_opts_hash_or_array(args)
        if n.is_a ? Numeric# Do nothing
        elsif n.is_a ? Hash
        init_args_h = resolve_synth_opts_hash_or_array(n)
        n = note(init_args_h[: note])
        return nil
        if n.nil ?
            n
        else
            n = note(n)
    }
    n += current_transpose
    args_h[: note] = n
    synth = current_synth
    final_args = init_args_h.merge(args_h)
    _reserved.send("cmd", {
        type: "note",
        synth: synth,
        note: n,
        noteLength: _reserved.sleep_mul,
        args: final_args.map
    });
}*/

// def play_pattern(notes, * args)
// notes.each { | note | play(note, * args);
//     sleep 1
// }
// end
//
// def play_pattern_timed(notes, times, * args)
// if times.is_a ? Array
// notes.each_with_index { | note, idx | play(note, * args);
//     sleep(times[idx % times.size])
// } else
//     notes.each_with_index { | note, idx | play(note, * args);
//         sleep times
//     }
// end
// end
//
// def play_chord(notes, * args)
// shift = current_transpose
// shifted_notes = notes.map do |n |
//         n = note(n) unless n.is_a ? Numeric
//     n + shift
// end
//
// synth_name = current_synth
// trigger_chord(synth_name, shifted_notes, args)
// end

function sample(name, args_h) {
    var _reserved_node_id = "" + _reserved.thread_id + "-" + _reserved.next_node_id;
    _reserved.next_node_id++;
    _reserved.send("cmd", {
        type: "sample",
        node_id: _reserved_node_id,
        sample: name,
        args: args_h || {}
    });
    return _reserved_node_id;
}

// def control(node, * args)
// args_h = resolve_synth_opts_hash_or_array(args)
// n = args_h[: note]
// args_h[: note] = note(n) if n
//
// _reserved_control node, args_h
// end
//
// def stop(node)
// _reserved_stop node
// end
//
// def _reserved_body
//     code_body
// end
//
//     % x {
//     onmessage = function (initEvent) {
//         _reserved.thread_id = initEvent.data.thread_id;
//
//         try {
//             $opal.Object._proto.$_reserved_body();
//         } catch (err) {
//             _reserved.send("error", err.toString());
//         }
//
//         _reserved.send("complete", {});
//     }
// }

/**
 * call an function asyncron
 * use an timer to let the eventloop invoke it.
 *
 * @param {function} func - function to invoke
 * @param {target} target - invoke the function in this context
 * @param {...} arguments - following arguments
 * @return {Object} Promis
 */
function callAsync(func, target) {
    target = target || (window || this);
    var slicedArgs = Array.prototype.slice.call(arguments, 2);

    setTimeout(function () {
        func.call(target, slicedArgs);
    }, 0);
}


var _fns = {};

function loop2(name, fn) {
    _fns[name] = fn;
    var defer = Q.defer();
    fn(defer.promise)
        .then(function () {
            setTimeout(function () {
                loop(name, fn);
            }, 1);
        });
    defer.resolve(fn)

    //return defer.promise;
}

function loop(name, fn) {
    //console.log(name);
    _fns[name] = fn;

    var _fn = Q.async(fn)
    _fn().then(function () {
        setTimeout(function () {
            loop(name, fn);
        }, 0);
    });
}

function delay2(delay, compensate) {
    var start = Date.now();
    var deferred = Q.defer();

    var id = setTimeout(function () {
        var end = Date.now();
        var actual = end - start;
        if (compensate && actual < delay) {
            id = setTimeout(resolveOrTryAgain, delay - actual);
            return;
        }
        deferred.resolve(actual);
    }, delay);

    return deferred.promise;
}

function delay(delay) {
    return Q.delay(delay);
}


try {
    (function () {
        [[code_body]]
    })();
} catch (ex) {
    print("code_body error :" + ex);
}