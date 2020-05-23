<template>
    <div
     class="center-child lobby-login-form">
        <div>

            <div
             class="text-left srsi-mb2"
             v-t="'ui.lobby.login.name'"/>

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
                     style="line-height: 1.15em;"
                     v-t="`ui.lobby.login.msg.${message}`"/>
                </div>

                <button
                 class="srsi-button"
                 @click="login"
                 :disabled="connecting"
                 v-t="'ui.lobby.login.enter'"/>
            </div>

        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { throttle } from 'HELPERS';

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
                    case 'pending':
                        this.message = 'connecting';
                        this.connecting = true;
                        break;

                    case 'no':
                        this.message = 'failed';
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
                    this.message = 'name_short';

                } else {
                    this.$app.openConnection(this.login_input);

                }
            }),
        },

    }
</script>

