<template>
    <div
     class="flex-fill d-flex flex-column srsi-m3 srsi-mr5 srsi-ml5">

        <div
         class="lobby-search">
            <magnify-icon
             class="srsi-ml2"
             :size="iconSize"/>
            <input
             type="text"
             v-model="search_input"
             :placeholder="$t('ui.lobby.search')"/>
        </div>

        <div
         class="flex-fill lobby-table srsi-mt3">
            <div
             v-for="({id, name}) in shownUsers"
             class="d-flex">

                <div>

                </div>

                <button
                 class="srsi-button-flat">
                    <email-icon
                     :size="iconSize * 0.75"/>
                </button>

                <div
                 class="flex-fill srsi-ml-4">
                    {{name}}
                </div>

            </div>

        </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { throttle } from 'HELPERS';

    import MagnifyIcon from 'ICONS/Magnify.vue';
    import EmailIcon from 'ICONS/Email.vue'

    export default {

        components: {
            MagnifyIcon,
            EmailIcon,
        },

        data ( ) {
            return {
                search_input: '',
                filter: '',
            }
        },

        mounted () {
            this.$app.sendRequest('A:LOBBY-STATE');
        },

        watch: {
            search_input: throttle(
                1000, true,
                function (value) {
                    this.filter = value;
                }
            )
        },

        computed: {
            ...mapState([
                'platform_size'
            ]),
            ...mapState({
                connected_user_id (state) {
                    return state.connected.id;
                },

                present_users (state) {
                    return state.lobby.users;
                }
            }),

            iconSize () {
                return this.platform_size.icon;
            },

            shownUsers () {
                const filter = this.filter.toLowerCase();
                const users = [];
                for (let user of this.present_users) {
                    if (this.connected_user_id === user.id) continue;
                    if (filter && !user.name.toLowerCase().includes(filter)) continue;

                    users.push(user);
                    if (users.lenght >= 10) break;
                }
                return users;
            },

        },

    }
</script>
