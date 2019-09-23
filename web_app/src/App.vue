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
                <cards-hands-remote/>
            </div>

            <div
             class="-ui">
                UIUIUIUI
            </div>

            <div
             class="-local-cards center-child">
                <cards-hand-local/>
            </div>

            <div
             class="-printout center-child">
                tohle je printout
            </div>

        </div>


    </div>
</template>

<script>
    import CardsDeck from './components/CardsDeck.vue';
    import CardsPile from './components/CardsPile.vue';
    import CardsHandLocal from './components/CardsHandLocal.vue';
    import CardsHandsRemote from './components/CardsHandsRemote.vue';

    export default {
        name: 'app',

        components: {
            CardsDeck,
            CardsPile,
            CardsHandLocal,
            CardsHandsRemote,
        },
    }
</script>
