<template>
    <div>
        <strong>
            {{$t('messages.invite.header', { name: msg.author })}} :
        </strong>
        <a
        href="#"
        @click="joinBoard"
        v-t="`messages.invite.link`"/>
    </div>
</template>

<script>
    import platform from "../../../src/platform";

    export default {

        props: [
            'msg'
        ],

        methods: {
            async joinBoard () {
                const { board_id } = this.msg;
                req = await this.$app.sendRequest('ACT-BOARD-ENTER', {
                    board_id
                });
                if (req.result.fail) {
                    console.error(req.result);
                    throw 'joinBoard';
                }

                // TODO CONTINUE

                // this.$store.dispatch('actionInitBoard', {
                //     id: board_id,
                //     local_player: 1,
                //     players: 2,
                //     deck: platform.newCardsDeck(),
                // });
            }
        },

    }
</script>
