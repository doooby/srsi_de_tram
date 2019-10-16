import ResizeObserver from 'resize-observer-polyfill';

import srsi from './srsi';
import { createStore } from './store';
import Vue from 'vue';
import App from './App';

const platform = {

    initialized: false,

    card_size: [7, 10],
    images: {},
    getImageData (card_id) {
        return platform.images[card_id];
    },

    async init () {
        if (platform.initialized) return;

        await buildCardsImages(
            this.images, ...platform.card_size.map(s => s * 20)
        );

        platform.initialized = true;
    },

    app_wh_base: [3, 2],
    app_max_size_mod: 250,

    async createApp (root, options={}) {
        if (!options.wh_base) options.wh_base = platform.app_wh_base;
        if (!options.max_size_mod) options.max_size_mod = platform.app_max_size_mod;
        const app = new Application(root, options);

        await platform.init();
        return app;
    },

};
export { platform as default };

class Application {

    constructor (element, options) {
        this.root = typeof element === 'string' ?
            document.querySelector(element) :
            element;
        this.root.innerHTML = '<div></div>';

        this.wh_base = options.wh_base;
        this.max_size_mod = options.max_size_mod;
        this.observeRootSize();

        this.startup();
    }

    startup () {
        this.store = createStore();

        this.vue = new Vue({
            el: this.root.firstChild,
            store: this.store,
            render: function (h) { return h(App); }
        });

        this.store.commit(
            'mutateSetPlatformMessage',
            'platform.startup'
        );
    }

    ready () {
        this.store.commit(
            'mutateSetPlatformMessage',
            null
        );
    }

    observeRootSize () {
        if (this.observer) return;

        const callback = throttle(
            200, false,
            () => {
                this.store.commit(
                    'mutateSetPlatformSize',
                    this.recomputeSize()
                );
            }
        );

        this.observer = new ResizeObserver(callback);
        this.observer.observe(this.root);
        callback();
    }

    recomputeSize () {
        const [w, h] = [
            this.root.clientWidth,
            this.root.clientHeight
        ];

        const [mw, mh] = this.wh_base.map(v => v * this.max_size_mod);
        if (w > mw && h > mh) {
            return [mw, mh];

        } else {
            const wh_ratio = this.wh_base[0] / this.wh_base[1];
            let new_w = w, new_h = w / wh_ratio;
            if (new_h > h) {
                new_h = h;
                new_w = h * wh_ratio;
            }
            return [
                Math.round(new_w),
                Math.round(new_h)
            ];

        }
    }

}

async function buildCardsImages (index, width, height) {
    const w_2 = width / 2;
    const h_2 = height / 2;
    const margin = Math.ceil(height / 30);

    srsi.cards.forEach(card => {
        const canvas = document.createElement('CANVAS');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = card.isRed() ? 'red' : 'black';
        ctx.textAlign = 'start';
        ctx.textBaseline = 'top';
        const text = card.transcription();

        let font = Math.ceil(height / 3.5);
        ctx.font = `${font}px serif`;
        ctx.fillText(
            text,
            w_2 - ctx.measureText(text).width / 2,
            h_2 - font / 2
        );

        font = Math.ceil(height / 9);
        ctx.font = `${font}px serif`;
        ctx.fillText(text, margin, margin, width);
        ctx.translate(w_2, h_2);
        ctx.rotate(Math.PI);
        ctx.translate(-w_2, -h_2);
        ctx.fillText(text, margin, margin, width);

        index[card.id] = canvas.toDataURL();
    });

    index['back'] = (function () {
        const canvas = document.createElement('CANVAS');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        const margin = Math.ceil(height / 11);
        ctx.fillStyle = 'gray';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(margin, margin, width - 2*margin, height - 2*margin);

        ctx.fillStyle = 'gray';
        let font = Math.ceil(height / 6);
        ctx.font = `${font}px serif`;
        let y_base = h_2 - font / 2;
        [ 'SRŠÍ', 'DE', 'TRAM' ].forEach((text, i) => ctx.fillText(
            text,
            w_2 - ctx.measureText(text).width / 2,
            y_base + i * font
        ));

        return canvas.toDataURL();
    }());
}

function throttle (time, immediate, fn) {
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
