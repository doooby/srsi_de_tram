import Vue from 'vue';
import store from './store';

import App from './App.vue';
import './assets/styles/index.scss';

import srsi from './srsi';

const main = new Vue({
    store,
    render: function (h) { return h(App); }
});
main.$mount('#srsi-entry');

setTimeout(() => {
    const game = new srsi.Game(
        [
            new srsi.Player('local'),
            new srsi.Player('Remote Player'),
        ],
        0
    );
    store.commit('mutateSetGame', game);
    store.commit('mutateSetGameState', game.state);

    game.begin(srsi.cards.createNewShuffledDeck());
    store.commit('mutateSetGameState', game.state);

    const local = game.local_player;
    local.subscribe('bad_move', (player, move) => {
        if (local !== player) return;
        store.dispatch('actionPrintoutMessage', move.error);
    });
    local.subscribe('moved', (player, move) => {
        if (local !== player) return;
        store.dispatch('actionMakeMove', {
            player: local,
            move
        });
    });

    store.commit('mutateGameStarted');

}, 1000);
