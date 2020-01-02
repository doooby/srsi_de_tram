export function throttle (time, immediate, fn) {
    let timeout, call_at_end, context, args;

    return function () {
        context = this;
        args = arguments;

        // throttling block
        if (timeout) {
            call_at_end = true;
            return;
        }

        // throttler - fire only if there was event in the mean-time
        function invocation() {
            timeout = null;
            if (call_at_end) {
                call_at_end = false;
                timeout = setTimeout(invocation, time);
                fn.apply(context, args);
            }
        }

        call_at_end = true;
        if (immediate) invocation();
        else timeout = setTimeout(invocation, time);
    };
}
