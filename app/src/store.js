import Vue from 'vue';
import Vuex from 'vuex';
import { localizedGetter } from '../lib/game_texts';
import { getResponsiveConst } from './utils';

Vue.use(Vuex);

export function createStore () {
    return new Vuex.Store({
        state: {

            platform_message: null,
            platform_size: Object.freeze([0, 0]),
            locale: 'cs',
            media: 'sm',

            game: null,
            game_state: null,
            game_started: false,
            printout: null,

        },
        getters,
        mutations,
        actions,
    });
}

const getters = {

    cardSizes ({ media }) {
        return {
            regular: [
                getResponsiveConst('card.regular.width', media),
                getResponsiveConst('card.regular.height', media)
            ],
            small: [
                getResponsiveConst('card.small.width', media),
                getResponsiveConst('card.small.height', media)
            ]
        }
    },

    textGet ({ locale }) {
        return localizedGetter(locale);
    },

    localPlayerOnTurn ({ game, game_state, game_started }) {
        return game && game_state && game_started &&
            game_state.on_move === game.local_player.index;
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
        state.game = game;
        state.game_state = game.state;
        state.game_started = false;
    },

    mutateGameStarted (state) {
        state.game_started = true;
    },

    mutateSetGameState (state, game_state) {
        state.game_state = game_state;
    },

    mutateSetPrintout (state, record) {
        Object.freeze(record);
        state.printout = record;
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

};
