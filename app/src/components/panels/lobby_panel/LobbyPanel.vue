<template>
    <div
     class="ui-lobby-panel">

        <div
         class="center-child lobby-login-form">
            <div>

                <div
                class="text-left srsi-mb2">
                    Jméno
                </div>

                <input
                type="text"
                class="srsi-input srsi-mb3"
                @change="loginInputChanged($event.target.value)"/>

                <div
                class="text-right">
                    <button
                     class="srsi-button"
                    @click="enterLobby">
                        VSTOUPIT
                    </button>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {

        data () {
            return {
                login_input: ''
            }
        },

        computed: {
            // ...mapGetters(['textGet']),
        },

        methods: {
            loginInputChanged (value) {
                this.login_input = value;
            },

            enterLobby () {
                if (this.login_input.length > 4) {
                    console.log(this.login_input);
                }
            }
        }

    }
</script>
