<template>
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
             class="d-flex align-items-start">
                <div
                 class="flex-fill position-relative">
                    <small
                     v-if="message !== null"
                     class="position-absolute w-100"
                     style="line-height: 1.15em;">
                        {{message}}
                    </small>
                </div>

                <button
                 class="srsi-button"
                 @click="login"
                 :disabled="connecting">
                    VSTOUPIT
                </button>
            </div>

        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { throttle } from '../../../src/helpers';

    export default {

        data () {
            return {
                login_input: '',
                message: null,
                connecting: false,
            }
        },

        computed: {
            ...mapState({
                connected: state => state.connected.state,
            }),
        },

        watch:{
            connected (value) {
                switch (value){
                    case 'p':
                        this.message = 'Připojuji k serveru ...';
                        this.connecting = true;
                        break;

                    case 'n':
                        this.message = 'Nepodařilo se připojit.';
                        this.connecting = false;
                        break;

                    default:
                        this.connecting = false;
                        break;
                }
            }
        },

        methods: {
            loginInputChanged (value) {
                this.login_input = value;
                this.message = null;
            },

            login: throttle(600, true, function () {
                if (this.login_input.length < 5) {
                    this.message = 'Jméno je příliš krátké.';

                } else {
                    this.$app.openConnection(this.login_input);

                }
            }),
        },

    }
</script>

