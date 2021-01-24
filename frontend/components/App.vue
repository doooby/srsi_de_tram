<template>
    <div
     class="srsi"
     :style="css_style">

        <div
         v-if="platform_message"
         class="platform-flash">
            <h2>
                {{platform_message}}
            </h2>
        </div>

        <div
         v-else

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
                <ui-panel/>
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
    import { mapState } from 'vuex';

    import CardsDeck from './CardsDeck.vue';
    import CardsPile from './CardsPile.vue';
    import LocalHand from './LocalHand.vue';
    import PrintoutPanel from './PrintoutPanel';
    import RemoteHands from './RemoteHands.vue';
    import UiPanel from './UiPanel';

    export default {
        name: 'app',

        components: {
            CardsDeck,
            CardsPile,
            LocalHand,
            PrintoutPanel,
            RemoteHands,
            UiPanel,
        },

        computed: {
            ...mapState([
                'platform_message',
                'platform_size'
            ]),

            css_style () {
                const { width, height, font } = this.platform_size;
                const font_size = font.toFixed(2);
                return {
                    width: `${width}px`,
                    height: `${height}px`,
                    fontSize: `${font_size}px`
                };
            }
        }

    }
</script>
