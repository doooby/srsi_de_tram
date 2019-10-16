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
    import srsi from '../srsi';

    export default {

        data () {
            return {
                card_bg: srsi.cardImage('back'),
            };
        },

        computed: {

            ...mapState(['game', 'game_state']),
            ...mapGetters(['cardSizes']),

            remoteHands () {
                if (!this.game || !this.game_state) return [];

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
