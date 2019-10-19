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
    import { mapState } from 'vuex';

    import platform from './platform';

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
        },

        computed: {
            ...mapState(['platform_message', 'platform_size']),

            css_style () {
                const { width, height, mod } = this.platform_size;
                const font_size = (mod * platform.app_max_font_size).toFixed(2);
                return {
                    width: `${width}px`,
                    height: `${height}px`,
                    fontSize: `${font_size}px`
                };
            }
        }

    }
</script>
