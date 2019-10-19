<template>
    <div
     class="remotes-list">
        <div
         v-for="hand in remoteHands"
         :key="hand.player.index"
         class="center-child">

            <div
             class="floating-label">
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
    import platform from '../platform';

    export default {

        data () {
            return {
                card_bg: platform.getImageData('back'),
            };
        },

        computed: {

            ...mapState(['game', 'game_state']),
            ...mapGetters(['cardSizes']),

            sessionOn () {
                return this.game &&this.game_state && this.game_state.on_move !== -1;
            },

            remoteHands () {
                if (!this.sessionOn) return [];

                return this.game.remotePlayers().map(player => ({
                    player,
                    cards: mapCardsToFlapper(
                        this.game_state.players[player.index],
                        this.cardSizes.small,
                        (card, transform) => ({
                            id: card.id,
                            css_styles: { transform }
                        })
                    )
                }));
            }

        }

    }
</script>
