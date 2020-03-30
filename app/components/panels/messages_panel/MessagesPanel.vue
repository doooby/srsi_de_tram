<template>
    <div>

        <button
         @click="send">
            SEND
        </button>

        <input
         type="text"
         v-model="text"/>

        <div
         v-for="msg in messages.list">
            <div>
                <strong>
                    {{msg.author}} :
                </strong>
                {{msg.text}}
            </div>
        </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {

        data () {
            return {
                text: 'karel'
            };
        },

        computed: {
            ...mapState([
                'messages'
            ]),
        },

        methods: {
            send () {
                const text = this.text;
                if (text.length === 0) return;
                this.text = '';
                this.$app.sendRequest('ACTION-LOBBY-MSG', { text });
            }
        },

    }
</script>
