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

                <button
                 v-if="!inSession"
                 class="srsi-button-flat">
                    <cards-playing-outline-icon
                     :size="iconSize * 0.75"
                     @click="playWith(id)"/>
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
    import { mapState, mapGetters } from 'vuex';
    import { throttle } from 'HELPERS';

    import MagnifyIcon from 'ICONS/Magnify.vue';
    import CardsPlayingOutlineIcon from 'ICONS/CardsPlayingOutline.vue'
    import platform from "../../../src/platform";

    export default {

        components: {
            MagnifyIcon,
            CardsPlayingOutlineIcon,
        },

        data ( ) {
            return {
                search_input: '',
                filter: '',
            }
        },

        mounted () {
            this.$app.sendRequest('ACT-LOBBY-REFRESH');
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
                'platform_size',
            ]),
            ...mapGetters([
                'inSession',
            ]),
            ...mapState({
                connected_user_id (state) {
                    return state.connected.id;
                },

                present_users (state) {
                    return state.lobby.users;
                },
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

        methods: {
            async playWith (opponent_id) {
                let req = await this.$app.sendRequest('ACT-BOARD-NEW');
                const board_id = req.result.id;

                req = await this.$app.sendRequest('ACT-BOARD-ENTER', {
                    board_id
                });
                if (req.result.fail) {
                    console.error(req.result);
                    throw 'playWith';
                }

                this.$store.dispatch('actionInitBoard', {
                    id: board_id,
                    local_player: 0,
                    players: 2,
                    deck: platform.newCardsDeck(),
                });

                this.$app.sendRequest('ACT-BOARD-INVITE', {
                   board_id,
                   conn_id: opponent_id
                });
            },
        },

    }
</script>
