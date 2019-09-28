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
    // new game
    const game = new srsi.Game(
        [
            new srsi.Player('local'),
            new srsi.Player('Remote Player'),
        ],
        0
    );
    game.history = [];
    window.GAME = game;
    store.commit('mutateSetGame', game);

    // PLAYER
    const local = game.local_player;
    local.subscribe('bad_move', (player, move) => {
        if (local !== player) return;
        store.dispatch('actionPrintoutMessage', {
            code: `bad_move.${move.error}`
        });
    });
    local.subscribe('state_changed', () => {
        store.commit('mutateSetGameState', game.state);
    });

    // AI
    game.remotePlayers().forEach(player => {
        const actor = new srsi.SimpleAi();
        player.attachActor(actor);
    });

    // begin the game
    game.begin(srsi.cards.createNewShuffledDeck());
    store.commit('mutateSetGameState', game.state);
    // let the players start
    // TODO just the state's on_move !== -1
    store.commit('mutateGameStarted');

}, 1000);
