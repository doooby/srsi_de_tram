import platform from './platform';

import '../styles/app.scss';

(async function () {

    const app1 = await platform.createApp('#app-1');
    app1.ready();

    // const app2 = await platform.createApp('#app-2');
    // app2.ready();

    setTimeout(() => {
        app1.startSession();
    }, 500);

}());