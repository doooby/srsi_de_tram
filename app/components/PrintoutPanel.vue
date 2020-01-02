<template>
    <div
     v-if="message"
     class="floating-label">
        {{message}}
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {

        computed: {
            ...mapState({
                printout: state => state.printout,
            }),

            message () {
                if (this.printout) {
                    const { text, code } = this.printout;
                    return text || this.$t(code);
                }
            }
        }

    }
</script>
