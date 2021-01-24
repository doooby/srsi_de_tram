<template>
    <div
     class="remotes-list">
        <div
         v-for="hand in remoteHands"
         :key="hand.player.index"
         class="center-child">

            <div
             class="floating-label">
                <span
                 v-if="hand.on_move"
                class="mr-3">
                ⇨
                </span>
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

    export default {

        data () {
            return {
                card_bg: this.$app.cards_drawing.getImageData('back'),
            };
        },

        computed: {

            ...mapState(['session']),
            ...mapGetters(['inSession']),

            remoteHands () {
                if (!this.inSession) return [];

                const drawing = this.$app.cards_drawing;
                const { game, state } = this.session;
                return game.remotePlayers().map(player => ({
                    player,
                    cards: drawing.mapCardsToFlapper(
                        state.players[player.index],
                        drawing.card_small_size,
                        (card, transform) => ({
                            id: card.id,
                            css_styles: { transform }
                        })
                    ),
                    on_move: state.on_move === player.index
                }));
            }

        }

    }
</script>
