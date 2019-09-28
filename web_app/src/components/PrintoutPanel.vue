<template>
    <div
     v-if="message"
     class="printout-alert">
        {{message}}
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { localizedGetter } from '../../lib/game_texts';

    export default {

        computed: {
            ...mapState({
                printout: state => state.printout,
                get_text: state => {
                    console.log(state);
                    return localizedGetter(state.locale);
                }
            }),

            message () {
                if (this.printout) {
                    const { text, code } = this.printout;
                    return text || this.get_text(code);
                }
            }
        }

    }
</script>
