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
                 @click="login">
                    VSTOUPIT
                </button>
            </div>

        </div>
    </div>
</template>

<script>
    import { throttle } from '../../../utils';


    export default {

        data () {
            return {
                login_input: '',
                message: null,
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
                    this.message = 'Probíhá přihlášení ...';

                }
            }),
        },

    }
</script>

