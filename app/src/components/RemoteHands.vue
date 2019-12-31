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
    import { mapCardsToFlapper } from '../utils';
    import platform from '../platform';

    export default {

        data () {
            return {
                card_bg: platform.getImageData('back'),
            };
        },

        computed: {

            ...mapState(['session']),
            ...mapGetters(['inSession']),

            remoteHands () {
                if (!this.inSession) return [];

                const { game, state } = this.session;
                return game.remotePlayers().map(player => ({
                    player,
                    cards: mapCardsToFlapper(
                        state.players[player.index],
                        platform.card_small_size,
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
