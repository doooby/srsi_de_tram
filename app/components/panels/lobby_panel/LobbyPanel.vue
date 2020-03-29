<template>
    <div
     class="ui-lobby-panel">

        <div
         v-if="userIsConnected"
         class="d-flex flex-column h-100">

            <lobby-browser />

            <div
             class="d-flex justify-content-center">
                {{connected.name}}
                <button
                 class="srsi-button-flat"
                 @click="logout">
                    <close-circle-outline-icon
                     :size="platform_size.icon * 0.75"/>
                </button>
                <span
                 class="srsi-mr2">
                    |
                    </span>
                {{$t('ui.lobby.present', { count: users_count })}}
                <button
                 class="srsi-button-flat"
                 @click="updateLobbyInfo"
                 :disabled="fetching">
                    <sync-icon
                     :size="platform_size.icon * 0.75"/>
                </button>
            </div>
        </div>

        <login-form
         v-else/>

    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';

    import LoginForm from './LoginForm';
    import LobbyBrowser from './LobbyBrowser';

    import CloseCircleOutlineIcon from 'ICONS/CloseCircleOutline.vue'
    import SyncIcon from 'ICONS/Sync.vue'

    export default {

        data () {
            return {
                fetching: false
            };
        },

        components: {
            LoginForm,
            LobbyBrowser,
            CloseCircleOutlineIcon,
            SyncIcon,
        },

        computed: {
            ...mapGetters([
                'userIsConnected',
            ]),
            ...mapState([
                'platform_size', 'connected'
            ]),
            ...mapState({
                users_count (state) {
                    return state.lobby.users.length;
                }
            })
        },

        methods: {
            logout () {
                this.$app.closeConnection();
            },

            async updateLobbyInfo () {
                this.fetching = true;
                await this.$app.sendRequest('A:LOBBY-STATE');
                this.fetching = false;
            }
        },

    }
</script>
