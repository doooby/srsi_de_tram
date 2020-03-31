<template>
    <div
     class="ui-messages-panel">

        <div
         class="messages-listing">
            <div
             v-for="msg in messages_list">
                <strong>
                    {{msg.author}} :
                </strong>
                {{msg.text}}
            </div>
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

    export default {

        data () {
            return {
                text: ''
            };
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
                this.$app.sendRequest('ACTION-LOBBY-MSG', { text });
            },

        },

    }
</script>
