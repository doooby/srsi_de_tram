<template>
    <div
     v-if="message"
     class="floating-label">
        {{message}}
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';

    export default {

        computed: {
            ...mapState({
                printout: state => state.printout,
            }),
            ...mapGetters(['textGet']),

            message () {
                if (this.printout) {
                    const { text, code } = this.printout;
                    return text || this.textGet(code);
                }
            }
        }

    }
</script>
