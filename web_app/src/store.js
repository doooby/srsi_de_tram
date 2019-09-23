import Vue from 'vue';
import Vuex from 'vuex';
import { getResponsiveConst } from './utils';

Vue.use(Vuex);

export default new Vuex.Store({

    state: {
        game_state: null,
        static: Object.freeze({}),
        media: 'sm'
    },

    mutations: {

        mutateSetGame (state, { game }) {
            state.game_state = null;
            updateStaticData(state, { game, begun: false });
        },

        mutateGameBegun (state) {
            updateStaticData(state, { begun: true });
        },

        mutatePutGameState (state) {
            state.game_state = state.static.game.state.freeze();
        },

    },

    actions: {

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
        }

    }

});

function updateStaticData (state, new_data) {
    state.static = Object.freeze({
        ...state.static,
        ...new_data
    });
}
