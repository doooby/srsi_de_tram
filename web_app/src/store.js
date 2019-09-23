import Vue from 'vue';
import Vuex from 'vuex';
import { getResponsiveConst } from './utils';

Vue.use(Vuex);

export default new Vuex.Store({

    state: {

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
            state.printout = record;
        },

    },

    actions: {

        actionMakeMove ({ state, commit }, { player, move }) {
            state.game.setState(
                move.applyTo(state.game_state),
                player
            );
            commit('mutateSetGameState', state.game.state);
        },

        actionPrintoutMessage ({ state, commit }, message) {
            const cleaner = () => {
                if (state.printout === record) commit('mutateSetPrintout', null);
            };

            const record = Object.freeze({
                message,
                cleaner: setTimeout(cleaner, 3000)
            });
            commit('mutateSetPrintout', record);
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
