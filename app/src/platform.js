import ResizeObserver from 'resize-observer-polyfill';
import * as utils from './utils';

import { createStore } from './store';
import Vue from 'vue';
import App from './App';

import { cards } from 'GAME_PATH/src/cards';

const PLATFORM_NORMAL_SIZE = [ 3, 2 ];
const CARD_NORMAL_SIZE = [ 7, 10 ];

const platform = {

    initialized: false,

    app_size_mod: 250,
    app_font_size: 16,
    app_icon_size: 24,

    card_regular_size: CARD_NORMAL_SIZE.map(a => a * 20),
    card_small_size: CARD_NORMAL_SIZE.map(a => a * 8),

    images: {},
    getImageData (card_id) {
        return platform.images[card_id];
    },

    async init () {
        if (platform.initialized) return;

        await buildCardsImages(
            this.images, ...platform.card_regular_size
        );

        platform.initialized = true;
    },

    async createApp (root, options={}) {
        if (!options.wh_base) options.wh_base = PLATFORM_NORMAL_SIZE;
        const app = new Application(root, options);

        await platform.init();
        return app;
    },

    newCardsDeck () {
        return cards.createNewShuffledDeck();
    },

    serializeCardsDeck (deck) {
        if (!deck) deck = cards.createNewShuffledDeck();
        return deck.map(c => c.id);
    },

    parseCardsDeck (ids) {
        return ids.map(id => cards.index[id]);
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

        const callback = utils.throttle(
            200, false,
            () => {
                const [ width, height ] = this.computeSize();
                const modifier = this.computeRelSize(height);
                this.store.commit(
                    'mutateSetPlatformSize',
                    {
                        width,
                        height,
                        modifier,
                        font: modifier * platform.app_font_size,
                        icon: modifier * platform.app_icon_size,
                    }
                );
            }
        );

        this.observer = new ResizeObserver(callback);
        this.observer.observe(this.root);
        callback();
    }

    computeSize () {
        const [w, h] = [
            this.root.clientWidth,
            this.root.clientHeight
        ];

        const [mw, mh] = this.wh_base.map(v => v * platform.app_size_mod);
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

    computeRelSize (platform_height) {
        const max_height = PLATFORM_NORMAL_SIZE[1] * platform.app_size_mod;
        return platform_height / max_height;
    }

    createLocalActor () {
        const store = this.store;
        return {
            attach (player) {
                this.player = player;
                this.player.subscribe('state_changed', (_, state) => {
                    store.commit('mutateSetGameState', state);
                });
                this.player.subscribe('bad_move', (player, move) => {
                    if (this.player !== player) return;
                    store.dispatch('actionPrintoutMessage', {
                        code: `bad_move.${move.error}`
                    });
                });
            }
        }
    }

    createRemoteActor (on_sync) {
        return {
            syncMove: on_sync,
            attach (player) {
                this.player = player;
                this.player.subscribe('moved', (player, move) => {
                    if (this.player !== player) {
                        move = move.serialize();
                        move.pl = player.index;
                        this.syncMove(move);
                    }
                });
            },
            receiveMove (move) {
                if (move.pl === this.player.index) {
                    this.player.makeMove(move);
                }
            }
        }
    }

}

async function buildCardsImages (index, width, height) {
    const w_2 = width / 2;
    const h_2 = height / 2;
    const margin = Math.ceil(height / 30);

    cards.forEach(card => {
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
