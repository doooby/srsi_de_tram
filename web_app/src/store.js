import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({

    state: {
        game_state: null,
        global: Object.freeze({})
    },

    mutations: {

        mutateSetGame (state, { game }) {
            state.game_state = null;
            updateGlobalData(state, { game, begun: false });
        },

        mutateGameBegun (state) {
            updateGlobalData(state, { begun: true });
        },

        mutatePutGameState (state) {
            state.game_state = state.global.game.state.freeze();
        },

    },

    actions: {

    }

});

function updateGlobalData (state, new_data) {
    state.global = Object.freeze({
        ...state.global,
        ...new_data
    });
}
