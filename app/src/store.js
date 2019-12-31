import Vue from 'vue';
import Vuex from 'vuex';
import { localizedGetter } from '../lib/game_texts';
import times from 'lodash/times';
import Game from 'GAME_PATH/src/game';
import Player from 'GAME_PATH/src/player';
import { cards } from 'GAME_PATH/src/cards';

Vue.use(Vuex);

export function createStore () {
    return new Vuex.Store({
        state: {

            platform_message: null,
            platform_size: Object.freeze({
                width: 0,
                height: 0,
                font_size: 0
            }),
            locale: 'cs',

            session: {},
            printout: null,

        },
        getters,
        mutations,
        actions,
    });
}

const getters = {

    textGet ({ locale }) {
        return localizedGetter(locale);
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

};

const actions = {

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
    }

};
