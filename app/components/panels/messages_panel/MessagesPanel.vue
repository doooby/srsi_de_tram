<template>
    <div
     class="ui-messages-panel">

        <div
         class="messages-listing">
            <message-component
             v-for="msg in messages_list"
             :key="Number(msg.time)"
             :msg="msg"/>
        </div>

        <div
         class="srsi-input-with-button">
            <input
             type="text"
             v-model="text"
             @keyup.enter="send"
             :disabled="!userIsConnected"/>
            <button
             class="srsi-button"
             @click="send"
             v-t="`ui.messages.send.btn`"
             :disabled="!userIsConnected"/>
        </div>

    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';

    import TextualMessage from './TextualMessage';
    import InvitationMessage from './InvitationMessage';

    const MessageComponent = {
        props: [ 'msg' ],
        render (h) {
            return h(this.getComponent(), {
                props: { msg: this.msg }
            });
        },
        methods: {
            getComponent () {
                switch (this.msg.type) {
                    case 'invite': return InvitationMessage;
                    default: return TextualMessage;
                }
            }
        }
    };

    export default {

        data () {
            return {
                text: ''
            };
        },

        components: {
            MessageComponent
        },

        computed: {
            ...mapState([
                'messages'
            ]),
            ...mapGetters([
                'userIsConnected'
            ]),

            messages_list () {
                return this.messages.list;
            }
        },

        watch: {
            messages_list () {
                setTimeout(() => {
                    const listing = this.$el.querySelector('.messages-listing');
                    if (listing) listing.lastChild.scrollIntoView();
                }, 0);
            },
        },

        methods: {

            send () {
                const text = this.text;
                if (text.length === 0) return;
                this.text = '';
                this.$app.sendRequest('ACT-LOBBY-MSG', { text });
            },

        },

    }
</script>
