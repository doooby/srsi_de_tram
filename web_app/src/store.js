import Vue from 'vue';
import Vuex from 'vuex';
import { getResponsiveConst } from './utils';

Vue.use(Vuex);

export default new Vuex.Store({

    state: {

        locale: 'cs',
        media: 'sm',

        game: null,
        game_state: null,
        game_started: false,
        printout: null,

    },

    mutations: {

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

    },

    actions: {

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

    },

    getters: {

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

        localPlayerOnTurn ({ game, game_state, game_started }) {
            return game && game_state && game_started &&
                game_state.on_move === game.local_player.index;
        },

    }

});
