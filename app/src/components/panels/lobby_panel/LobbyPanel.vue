<template>
    <div
     class="ui-lobby-panel">

        <login-form/>


    </div>
</template>

<script>
    import { mapState } from 'vuex';

    import LoginForm from './LoginForm';

    export default {

        components: {
            LoginForm,
        },

        computed: {
            // ...mapGetters(['textGet']),
        },

        methods: {

        },

    }
</script>
