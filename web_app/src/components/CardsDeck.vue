<template>
    <div
     class="cards-deck srsi-cards">
        <div
         v-for="item in cardsItems"
         :key="item.id"
         :class="item.playable ? '-selectable' : ''"
         :style="item.css_styles"
         @click="drawCards()">
            <img
             :src="card_bg"/>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import { cardCssTransformation, spreadInsideCircle } from '../utils';
    import srsi from '../srsi';

    export default {

        data () {
            return {
                card_bg: srsi.images.back,
            };
        },

        computed: {

            ...mapState(['game', 'game_state']),
            ...mapGetters(['cardSizes', 'localPlayerOnTurn']),

            cards () {
                if (this.game_state) {
                    return this.game_state.deck;
                } else {
                    return [];
                }
            },

            cardsItems () {
                return this.cards.map((card, i, arr) => {

                    const [x, y] = spreadInsideCircle(
                        0.06 * this.cardSizes.regular[0],
                        (Math.random() * 2 * Math.PI)
                    );
                    const rot = (Math.random() - 0.5) * 0.04;

                    return {
                        id: card.id,
                        playable: (
                            i === arr.length - 1 &&
                            this.localPlayerOnTurn
                        ),
                        css_styles: {
                            transform: cardCssTransformation(
                                x, y, rot, ...this.cardSizes.regular
                            )
                        }
                    }
                });
            }

        },

        methods: {

            drawCards () {
                if (!this.localPlayerOnTurn) return;
                this.game.local_player.makeMove('draw');
            }

        }

    }
</script>
