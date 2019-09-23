import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({

    state: {
        game_state: null,
        static: Object.freeze({})
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

    }

});

function updateStaticData (state, new_data) {
    state.static = Object.freeze({
        ...state.static,
        ...new_data
    });
}
