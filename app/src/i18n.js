import Vue from 'vue';
import VueI18n from 'vue-i18n';

import game_cs from 'GAME_PATH/texts/cs.json';

Vue.use(VueI18n);

export function createI18n () {
    return new VueI18n({
        locale: 'cs',
        messages: {
            cs: {
                game: game_cs,
                ui: ui_cs
            }
        },
    });
}

const ui_cs = {
    lobby: {
        header: 'Lobby',
        present: 'Přítomno: {count}',
        search: 'Vyhledat dle jména ...',
        login: {
            name: 'Jméno',
            enter: 'Vstoupit',
            msg: {
                name_short: 'Jméno je příliš krátké.',
                connecting: 'Připojuji k serveru ...',
                failed: 'Nepodařilo se připojit.',
            }
        },
    },
};

