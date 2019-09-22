import Vue from 'vue';
import store from './store';

import App from './App.vue';
import './assets/styles/index.scss';

const main = new Vue({
    store,
    render: function (h) { return h(App); }
});
main.$mount('#srsi-entry');
