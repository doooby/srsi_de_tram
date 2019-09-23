<template>
    <div
     class="srsi">
        <div

         class="board">

            <div
             class="-deck center-child">
                <cards-deck/>
            </div>

            <div
             class="-pile center-child">
                <cards-pile/>
            </div>

            <div
             class="-remotes">
                <remote-hands/>
            </div>

            <div
             class="-ui">
                UIUIUIUI
            </div>

            <div
             class="-local-cards center-child">
                <local-hand/>
            </div>

            <div
             class="-printout center-child">
                <div
                 v-if="printoutMessage"
                 class="printout-alert">
                    {{printoutMessage}}
                </div>
            </div>

        </div>


    </div>
</template>

<script>
    import { mapState } from 'vuex';

    import CardsDeck from './components/CardsDeck.vue';
    import CardsPile from './components/CardsPile.vue';
    import LocalHand from './components/LocalHand.vue';
    import RemoteHands from './components/RemoteHands.vue';

    export default {
        name: 'app',

        components: {
            CardsDeck,
            CardsPile,
            LocalHand,
            RemoteHands,
        },

        computed: {
            ...mapState({
                printoutMessage: state => state.printout && state.printout.message
            })
        }

    }
</script>
