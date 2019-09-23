<template>
    <div
     class="remotes-list">
        <div
         v-for="hand in remoteHands"
         :key="hand.player.index"
         class="center-child">

            <div
             class="remote-label">
                {{hand.player.name}}
            </div>

            <div
             class="srsi-cards -small">
                <div
                 v-for="item in hand.cards"
                 :key="item.id"
                 :style="item.css_styles">
                    <img
                     :src="card_bg"/>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { getResponsiveConst, mapCardsToFlapper } from '../utils';
    import srsi from '../game';

    const CARD_WIDTH = getResponsiveConst('card.small.width');
    const CARD_HEIGHT = getResponsiveConst('card.small.height');
    console.log(CARD_WIDTH, CARD_HEIGHT);

    export default {

        data () {
            return {
                card_bg: srsi.images.back,
            };
        },

        computed: {

            ...mapState([
                'game_state'
            ]),

            remoteHands () {
                const { game, begun } = this.$store.state.static;
                if (!game || !begun) return [];
                if (!this.game_state) return [];

                return game.remotePlayers().map(player => {

                    const cards = mapCardsToFlapper(
                        this.game_state.players[player.index],
                        [CARD_WIDTH, CARD_HEIGHT],
                        (card, transform) => ({
                            id: card.id,
                            css_styles: { transform }
                        })
                    );

                    return {
                        player,
                        cards
                    };
                });
            }

        }

    }
</script>
