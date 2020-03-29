<template>
    <div
     class="ui-lobby-panel">

        <div
         v-if="connected"
         class="d-flex flex-column h-100">

            <lobby-browser
             :users="present"/>

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
                {{$t('ui.lobby.present', { count: present.length })}}
                <button
                 class="srsi-button-flat"
                 @click="getUsers"
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
    import { mapState } from 'vuex';

    import LoginForm from './LoginForm';
    import LobbyBrowser from './LobbyBrowser';

    import CloseCircleOutlineIcon from 'ICONS/CloseCircleOutline.vue'
    import SyncIcon from 'ICONS/Sync.vue'

    export default {

        data () {
            return {
                fetching: false,
                present: []
            };
        },

        components: {
            LoginForm,
            LobbyBrowser,
            CloseCircleOutlineIcon,
            SyncIcon,
        },

        computed: {
            ...mapState([
                'platform_size'
            ]),
            ...mapState({
                connected: store_state => {
                    const { state, id, name } = store_state.connected;
                    if (state !== 'y') return null;
                    else return { id, name };
                }
            }),
        },

        watch: {
            connected(value) {
                if (value) this.getUsers();
            }
        },

        mounted () {
            if (this.connected) this.getUsers();
        },

        methods: {
            logout () {
                this.$app.closeConnection();
            },

            async getUsers () {
                this.fetching = true;
                const req = await this.$app.sendRequest('get_users');
                this.fetching = false;
                console.log(req.result);
                this.present = req.result.users || [];
            }
        },

    }
</script>
