import LobbyPanel from './lobby_panel/LobbyPanel';

export const panelContentProxy = {

    props: [ 'typeName' ],

    render (h) {
        return h(this.getPanelContentComponent());
    },

    methods: {
        getPanelContentComponent () {
            switch (this.typeName) {
                case 'lobby': return LobbyPanel;
                default: return 'div';
            }
        }
    }

};
