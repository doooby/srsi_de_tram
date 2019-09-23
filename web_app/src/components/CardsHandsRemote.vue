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
    import { mapState, mapGetters } from 'vuex';
    import { mapCardsToFlapper } from '../utils';
    import srsi from '../game';

    export default {

        data () {
            return {
                card_bg: srsi.images.back,
            };
        },

        computed: {

            ...mapState(['game_state']),
            ...mapGetters(['cardSizes']),

            remoteHands () {
                const { game, begun } = this.$store.state.static;
                if (!game || !begun) return [];
                if (!this.game_state) return [];

                return game.remotePlayers().map(player => {

                    const cards = mapCardsToFlapper(
                        this.game_state.players[player.index],
                        this.cardSizes.small,
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
