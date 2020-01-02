<template>
    <div
     class="srsi-panel ui-panel">
        <div
         v-if="!!ui_panel"
         class="-panel-holder">
            <div
             class="panel-overlay">
                <panel-component
                 :panel-props="ui_panel"/>
            </div>
        </div>

        <div
         class="ui-buttons">
            <div>

                <div>
                    <button
                     class="srsi-button"
                     @click="toggleUiPanel('lobby')">
                        <account-icon
                        :size="iconSize"/>
                    </button>
                </div>

                <div>
                    <button
                     class="srsi-button"
                     @click="toggleUiPanel('menu')">
                        <settings-icon
                         :size="iconSize"/>
                    </button>
                </div>

                <div>
                    <button
                     class="srsi-button"
                     @click="toggleUiPanel('messages')">
                        <email-icon
                         :size="iconSize"/>
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';

    import PanelComponent from './panels/PanelComponent';

    import AccountIcon from 'ICONS/Account.vue';
    import SettingsIcon from 'ICONS/Settings.vue';
    import EmailIcon from 'ICONS/Email.vue';

    export default {

        components: {
            PanelComponent,

            AccountIcon,
            SettingsIcon,
            EmailIcon,
        },

        computed: {
            ...mapState([
                'ui_panel',
                'platform_size'
            ]),

            iconSize () {
                return this.platform_size.icon * 1.2;
            },
        },

        methods: {
            ...mapActions([
                'toggleUiPanel'
            ]),
        }

    }
</script>
