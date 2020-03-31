import Vue from 'vue';
import Vuex from 'vuex';
import times from 'lodash/times';
import Game from 'GAME_PATH/src/game';
import Player from 'GAME_PATH/src/player';

Vue.use(Vuex);

function createRecord (klass, attributes={}) {
    attributes.__proto__ = klass.prototype;
    if (klass.constructor) klass.constructor.call(attributes);
    Object.freeze(attributes);
    return attributes;
}

export function createStore () {
    return new Vuex.Store({
        state: {

            platform_message: null,
            platform_size: Object.freeze({
                width: 0,
                height: 0,
                modifier: 0,
                font: 0,
                icon: 0,
            }),

            session: {},
            printout: null,

            ui_panel: null,
            connected: {
                state: '0',
                name: '',
                id: null
            },

            lobby: {
                users: []
            },

            messages: {
                last_read: 0,
                list: []
            }
        },
        getters,
        mutations,
        actions,
    });
}

const getters = {

    userIsConnected ({ connected }) {
        return connected.state === 'y';
    },

    inSession ({ session }) {
        const { game, state } = session;
        return game && state && state.on_move !== -1;
    },

    localPlayerOnTurn ({ session }) {
        const { game, state } = session;
        return game && state && state.on_move === game.local_player.index;
    },

};

const mutations = {

    mutateSetPlatformMessage (state, message) {
        state.platform_message = message;
    },

    mutateSetPlatformSize (state, size) {
        state.platform_size = Object.freeze(size);
    },

    mutateSetGame (state, game) {
        state.session = Object.freeze({
            game: game,
            state: game.state
        });
    },

    mutateSetGameState (state, game_state) {
        state.session = Object.freeze({
            game: state.session.game,
            state: game_state
        });
    },

    mutateSetPrintout (state, record) {
        state.printout = Object.freeze(record);
    },

    mutateOpenUiPanel (state, panel_data) {
        state.ui_panel = Object.freeze(panel_data);
    },

    mutateCloseUiPanel (state) {
        state.ui_panel = null;
    },

    mutateSetConnectionPending (state) {
        state.connected.state = 'p';
    },

    mutateSetConnectedUser (state, user) {
        if (user) {
            state.connected.state = 'y';
            state.connected.id = user.id;
            state.connected.name = user.name;
        } else {
            state.connected.state = 'n';
            state.connected.id = null;
        }
    },

    'MSG-CONN-NEW': function (state, { id, name }) {
        state.lobby.users.push({ id, name });
    },

    'MSG-CONN-LOST': function (state, { id }) {
        const users = state.lobby.users;
        const lost_user = users.find(user => user.id === id);
        if (!lost_user) return;

        const index = users.indexOf(lost_user);
        users.splice(index, 1);
    },

    'MSG-LOBBY-STATE': function (state, { users }) {
        state.lobby.users = users;
    },

    'MSG-LOBBY-MESSAGE': function (state, msg) {
        const list = state.messages.list;
        list.push(createRecord(Message, msg));
        const overflow = list.length - 50;
        if (overflow > 0) list.splice(0, overflow);
    },

};

const actions = {

    toggleUiPanel ({ state, commit }, name) {
        if (state.ui_panel && state.ui_panel.type === name) {
            commit('mutateCloseUiPanel');

        } else {
            commit('mutateOpenUiPanel', {
               type: name
            });
        }
    },

    actionPrintoutMessage ({ state, commit }, msg) {
        const printout = {
            text: msg.text,
            code: msg.code
        };

        if (!msg.persistent) {
            printout.cleaner = setTimeout(
                () => {
                    const current = state.printout;
                    if (current && current.cleaner === printout.cleaner) {
                        commit('mutateSetPrintout', null);
                    }
                },
                3000
            );
        }

        commit('mutateSetPrintout', printout);
    },

    actionStartNewSession ({ state, commit }, session) {
        if (state.session.game) {
            for (const player of state.session.game.players) {
                player.detachActor();
            }
        }

        const game = new Game(
            times(session.actors.length, i => new Player(`P${i}`)),
            session.local
        );
        game.history = [];
        commit('mutateSetGame', game);

        for (let i=0; i<session.actors.length; i+=1) {
            game.players[i].attachActor(
                session.actors[i]
            );
        }

        game.begin(session.deck);
    },

};

class Message {


}
