<template>
    <div
     class="srsi-panel ui-panel">
        <div
         v-if="panelIsOpened"
         class="-panel-holder">
            <div
             class="panel-overlay">
                <panel-component/>
            </div>
        </div>

        <div
         class="ui-buttons">

            <div>
                <button
                 class="srsi-control">
                    b1
                </button>
            </div>

            <div>
                <button
                 class="srsi-control">
                    b2
                </button>
            </div>

            <div>
                <button
                 class="srsi-control">
                    b3
                </button>
            </div>

        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    import PanelComponent from './ui/PanelComponent';

    export default {

        components: {
            PanelComponent,
        },

        computed: {
            ...mapState({
                panelIsOpened: state => !!state.ui_panel
            }),
        },

    }
</script>
