<template>
    <div
     class="srsi">
        <div

         class="board">

            <div
             class="deck center-child">
                <cards-deck/>
            </div>

            <div
             class="pile">
                <cards-pile/>
            </div>

            <div
             class="remotes">
                <remote-hands/>
            </div>

            <div
             class="ui">
                UI
            </div>

            <div
             class="local-cards">
                <local-hand/>
            </div>

            <div
             class="printout center-child">
                <printout-panel/>
            </div>

        </div>


    </div>
</template>

<script>
    import CardsDeck from './components/CardsDeck.vue';
    import CardsPile from './components/CardsPile.vue';
    import LocalHand from './components/LocalHand.vue';
    import PrintoutPanel from './components/PrintoutPanel';
    import RemoteHands from './components/RemoteHands.vue';

    export default {
        name: 'app',

        components: {
            CardsDeck,
            CardsPile,
            LocalHand,
            PrintoutPanel,
            RemoteHands,
        }

    }
</script>
