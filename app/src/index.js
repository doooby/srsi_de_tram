import Vue from 'vue';
import store from './store';

import App from './App';
import '../styles/app.scss';

import srsi from './srsi';

function mount(element) {
    new Vue({
        el: element,
        store,
        render: function (h) { return h(App); }
    });
}

const mount_point = document.getElementById('app-mount-point');
mount(mount_point);

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
