import { mapState, mapActions } from 'vuex';

export const PanelContent = {

    computed: {
        ...mapState({
            panel_data: state => state.ui_panel
        }),

        panel_name () {
            if (this.panel_data) {
                return this.panel_data.type;
            } else {
                return null;
            }
        }
    },

    render (h) {
        return h('div', {}, ['ahoj']);
    },

};
