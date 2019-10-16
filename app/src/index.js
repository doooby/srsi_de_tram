import platform from './platform';

import '../styles/app.scss';

(async function () {

    const app1 = await platform.createApp('#app-1');
    app1.ready();

    const app2 = await platform.createApp('#app-2');
    app2.ready();
// const app2 = mountNewApp('#app-mount-point-2');

    // setTimeout(() => {
    //     return;
    //     const store = app1.store;
    //
    //     // new game
    //     const game = new srsi.Game(
    //         [
    //             new srsi.Player('local'),
    //             new srsi.Player('Remote Player'),
    //         ],
    //         0
    //     );
    //     game.history = [];
    //     window.GAME = game;
    //     store.commit('mutateSetGame', game);
    //
    //     // PLAYER
    //     const local = game.local_player;
    //     local.subscribe('bad_move', (player, move) => {
    //         if (local !== player) return;
    //         store.dispatch('actionPrintoutMessage', {
    //             code: `bad_move.${move.error}`
    //         });
    //     });
    //     local.subscribe('state_changed', () => {
    //         store.commit('mutateSetGameState', game.state);
    //     });
    //
    //     // AI
    //     game.remotePlayers().forEach(player => {
    //         const actor = new srsi.SimpleAi();
    //         player.attachActor(actor);
    //     });
    //
    //     // begin the game
    //     game.begin(srsi.cards.createNewShuffledDeck());
    //     store.commit('mutateSetGameState', game.state);
    //     // let the players start
    //     // TODO just the state's on_move !== -1
    //     store.commit('mutateGameStarted');
    //
    // }, 1000);

}());