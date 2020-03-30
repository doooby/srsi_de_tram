import LobbyPanel from './lobby_panel/LobbyPanel';
import MessagesPanel from './messages_panel/MessagesPanel';

export const panelContentProxy = {

    props: [ 'typeName' ],

    render (h) {
        return h(this.getPanelContentComponent());
    },

    methods: {
        getPanelContentComponent () {
            switch (this.typeName) {
                case 'lobby': return LobbyPanel;
                case 'messages': return MessagesPanel;
                default: return 'div';
            }
        }
    }

};
