import Vue from 'vue';
import uuid from 'uuid/v4';

import { createStore } from './store';
import { createI18n } from './i18n';
import App from '../components/App';
import CardsDrawing from './cards_drawing';
import ResizeActor from './resize_actor';

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

export default class Application {

    constructor (element, options) {
        this.root = typeof element === 'string' ?
            document.querySelector(element) :
            element;
        this.root.innerHTML = '<div></div>';

        this.options = options;
        this.resize_actor = new ResizeActor(this);
        this.cards_drawing = new CardsDrawing(this);

        this.store = null;
        this.i18n = null;
        this.vue = null;

        this.connected = false;
        this.socket = null;
        this.active_requests = null;

        this.startup();
    }

    startup () {
        this.store = createStore();
        this.i18n = createI18n();
        this.resize_actor.start();

        this.vue = new Vue({
            el: this.root.firstChild,
            store: this.store,
            i18n: this.i18n,
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

        // if DEBUG
        window.SRSI_DE_TRAM = this;
    }

    resized (platform_size) {
        this.store.commit(
            'mutateSetPlatformSize',
            platform_size
        );
    }

    // ////////////////////////////////////////////////////////////////////////////
    // // GAME
    //
    // createLocalActor () {
    //     const store = this.store;
    //     return {
    //         attach (player) {
    //             this.player = player;
    //             this.player.subscribe('state_changed', (_, state) => {
    //                 store.commit('mutateSetGameState', state);
    //             });
    //             this.player.subscribe('bad_move', (player, move) => {
    //                 if (this.player !== player) return;
    //                 store.dispatch('actionPrintoutMessage', {
    //                     code: `game.bad_move.${move.error}`
    //                 });
    //             });
    //         }
    //     }
    // }
    //
    // createRemoteActor (on_sync) {
    //     return {
    //         syncMove: on_sync,
    //         attach (player) {
    //             this.player = player;
    //             this.player.subscribe('moved', (player, move) => {
    //                 if (this.player !== player) {
    //                     move = move.serialize();
    //                     move.pl = player.index;
    //                     this.syncMove(move);
    //                 }
    //             });
    //         },
    //         receiveMove (move) {
    //             if (move.pl === this.player.index) {
    //                 this.player.makeMove(move);
    //             }
    //         }
    //     }
    // }


    ////////////////////////////////////////////////////////////////////////////
    // Websocket Connection

    openConnection (user_name) {
        if (this.connected) return;

        this.store.commit('mutateSetConnectionPending');

        this.socket = new WebSocket(`ws://${window.location.host}/connect`);
        this.active_requests = new RequestQueue();

        this.socket.onopen = async () => {
            console.log('[SOCKET] Opened');
            this.connected = true;
            const req = await this.sendRequest('ACT-LOBBY-ENTER', {
                name: user_name
            });
            if (req.result.fail) {
                this.closeConnection();

            } else {
                this.store.commit('mutateSetConnectedUser', {
                    id: req.result.id,
                    name: user_name
                });

            }
        };

        this.socket.onclose = () => {
            this.connected = false;
            this.store.commit('mutateSetConnectedUser', null);
        };

        this.socket.onmessage = event => {
            try {
                const data = JSON.parse(event.data);
                if (data.req) {
                    const req = this.active_requests.find(data.req);
                    if (req) {
                        delete data.req;
                        console.log(
                            `[SOCKET] Request | ${req.data.action} |`,
                            data
                        );
                        req.resolve(data);
                    }

                } else if (data.msg) {
                    this.process_message(data);

                }

            } catch (err) {
                console.error('[SOCKET] Failed | onmessage |');
                console.error(err);
            }
        }
    }

    closeConnection () {
        if (this.connected) {
            this.socket.close();
            this.connected = false;
            this.socket = null;
        }
    }

    sendRequest (action, data={}) {
        if (!this.connected) throw `${action} requested, but connection is down`;

        const request = new Request(data, action);
        this.active_requests.add(request);
        this.socket.send(JSON.stringify(request.data));
        return request.process(() => {
            this.active_requests.remove(request);
        });
    }

    process_message (data) {
        const msg_name = data.msg;
        delete data.msg;
        console.log(
            `[SOCKET] Message | ${msg_name} |`,
            data
        );
        this.store.commit(msg_name, data);
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
                    this.result = { fail: true, msg: 'timeout', };
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