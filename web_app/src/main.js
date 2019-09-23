import Vue from 'vue';
import store from './store';

import App from './App.vue';
import './assets/styles/index.scss';

import srsi from './game';

const main = new Vue({
    store,
    render: function (h) { return h(App); }
});
main.$mount('#srsi-entry');

setTimeout(() => {
    const game = new srsi.Game(
        [
            new srsi.Player('karel'),
            new srsi.Player('marek'),
        ],
        0
    );
    store.commit('mutateSetGame', { game });

    game.begin(srsi.cards.createNewShuffledDeck());
    store.commit('mutatePutGameState');

    store.commit('mutateGameBegun');

}, 1000);
