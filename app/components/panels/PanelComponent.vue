<template>
    <div
     class="srsi-panel panel-container">
        <div
         class="srsi-button -header"
         v-t="`ui.${panelProps.type}.header`"/>

        <div
         class="-close">
            <div>
                <button
                 class="srsi-button"
                 @click="closeUiPanel">
                    <close-icon
                     :size="platform_size.icon"/>
                </button>
            </div>
        </div>

        <panel-content
         :type-name="panelProps.type"/>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { panelContentProxy } from './panels';

    import CloseIcon from 'ICONS/Close.vue'

    export default {

        props: [ 'panelProps' ],

        components: {
            PanelContent: panelContentProxy,
            CloseIcon,
        },

        computed: {
            ...mapState([
                'platform_size'
            ]),
        },

        methods: {
            closeUiPanel () {
                this.$app.store.commit('mutateCloseUiPanel');
            },
        }

    }
</script>
