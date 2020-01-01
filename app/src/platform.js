import ResizeObserver from 'resize-observer-polyfill';
import uuid from 'uuid/v4';
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

        await utils.buildCardsImages(
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

Vue.use({
    name: 'AppMixin',
    version: '1.0.0',
    install () {
        Vue.mixin({
            beforeCreate () {
                const { parent, application } = this.$options;
                if (application) {
                    this.$app = application;
                } else if (parent && parent.$app) {
                    this.$app = parent.$app;
                }
            }
        });
    }
});

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
            render: function (h) { return h(App); },
            application: this
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
        window.app = this;
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

    openConnection (user_name) {
        if (this.connected || this.connecting) return;

        this.store.commit('mutateSetConnectionPending');

        this.socket = new WebSocket(`ws://${window.location.host}/connect`);
        this.active_requests = new RequestQueue();

        this.socket.onopen = async () => {
            this.connected = true;
            const req = await this.sendRequest('set_name', { name: user_name });
            if (req.result.ok) {
                this.store.commit('mutateSetConnectedUser', {
                    id: req.result.user_id,
                    name: user_name
                });

            } else {
                this.socket.close();

            }
        };

        this.socket.onclose = () => {
            this.connected = false;
            this.store.commit('mutateSetConnectedUser');
        };

        this.socket.onmessage = event => {
            try {
                const data = JSON.parse(event.data);
                const req = this.active_requests.find(data.req);
                if (req) req.resolve(data);

            } catch {}
        }
    }

    closeConnection () {
        if (this.connected) this.socket.close();
    }

    sendRequest (action, data={}) {
        const request = new Request(data, action);
        this.active_requests.add(request);
        this.socket.send(JSON.stringify(request.data));
        return request.process(() => {
            this.active_requests.remove(request);
        });
    }

}

class Request {

    constructor (data, action) {
        this.id = uuid();
        this.data = typeof data === 'object' ? data : {};
        this.data.id = this.id;
        this.data.action = action;

        this.result = null;
        this.resolve = null;
    }

    async process (on_done) {
        const promise = new Promise (resolve => {
            let resolved = false;

            const timeout = setInterval(() => {
                if (!resolved) {
                    resolved = true;
                    this.result = { ok: false, fail: 'timeout', };
                    resolve();
                }
            }, 10000);

            this.resolve = (result) => {
                if (!resolved) {
                    resolved = true;
                    if (timeout) clearTimeout(timeout);
                    this.result = result;
                    resolve();
                }
            };
        });

        await promise;
        on_done();
        return this;
    }

}

class RequestQueue {

    constructor () {
        this.clear();
    }

    clear () {
        this.array = [];
        this.last = -1;
        this.size = 0;
    }

    find (id) {
        for (const request of this.array) {
            if (request && request.id === id) return request;
        }
    }

    add (request) {
        this.last += 1;
        request.queue_position = this.last;
        this.array[this.last] = request;
        this.size += 1;
    }

    remove (request) {
        const pos = request.queue_position;
        if (request !== this.array[pos]) return;

        this.array[pos] = undefined;
        this.size -= 1;

        if (this.last + 33 > this.size) {
            this.compact();
        }
    }

    compact () {
        const old_array = this.array;
        this.clear();
        for (const request of old_array) {
            if (request) this.add(request);
        }
    }

}
