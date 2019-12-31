import platform from './platform';
import SimpleAi from 'GAME_PATH/src/simple_ai';

import '../styles/app.scss';

(async function () {

    const app1 = await platform.createApp('#app-1');
    app1.ready();

    const app2 = await platform.createApp('#app-2');
    app2.ready();

    setTimeout(() => {

        document.getElementById('action-new-ai')
            .addEventListener('click', () => {
                app1.store.dispatch('actionStartNewSession', {
                    local: 0,
                    deck: platform.newCardsDeck(),
                    actors: [
                        app1.createLocalActor(),
                        new SimpleAi()
                    ]
                });
            });

        document.getElementById('action-new-vs')
            .addEventListener('click', () => {

                const deck_cards = platform.serializeCardsDeck();

                const remote_app1 = app1.createRemoteActor(move => {
                    remote_app2.receiveMove(move);
                });
                const remote_app2 = app1.createRemoteActor(move => {
                    remote_app1.receiveMove(move);
                });

                app1.store.dispatch('actionStartNewSession', {
                    local: 0,
                    deck: platform.parseCardsDeck(deck_cards),
                    actors: [
                        app1.createLocalActor(),
                        remote_app1
                    ]
                });

                app2.store.dispatch('actionStartNewSession', {
                    local: 1,
                    deck: platform.parseCardsDeck(deck_cards),
                    actors: [
                        remote_app2,
                        app2.createLocalActor()
                    ]
                });

            });



    }, 500);

}());