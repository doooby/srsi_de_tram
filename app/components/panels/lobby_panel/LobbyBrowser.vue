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
             v-for="({id, name}) in filteredUsers"
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

        props: [
            'users'
        ],

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

            iconSize () {
                return this.platform_size.icon;
            },

            filteredUsers () {
                const filter = this.filter.toLowerCase();
                return this.users.filter(
                    ({name}) => name.toLowerCase().includes(filter)
                );
            },

        },

    }
</script>
