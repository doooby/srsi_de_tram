<template>
    <div
     class="cards-deck srsi-cards">
        <div
         v-for="item in cardsItems"
         :key="item.id"
         :class="item.css_class"
         :style="item.css_styles">
            <img
             :src="card_bg"/>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { getResponsiveConst, cardCssTransformation, spreadInsideCircle } from '../utils';
    import srsi from '../game';

    const CARD_WIDTH = getResponsiveConst('card.regular.width');
    const CARD_HEIGHT = getResponsiveConst('card.regular.height');
    const CARDS_SPREAD_RADIUS = 0.06 * CARD_WIDTH;
    const CARDS_ROT_MAX = 0.04;

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

            cards () {
                if (this.game_state) {
                    return this.game_state.deck;
                } else {
                    return [];
                }
            },

            cardsItems () {
                const data = this.cards.map(card => {

                    const [x, y] = spreadInsideCircle(
                        CARDS_SPREAD_RADIUS,
                        (Math.random() * 2 * Math.PI)
                    );
                    const rot = (Math.random() - 0.5) * CARDS_ROT_MAX;

                    return {
                        id: card.id,
                        css_class: '',
                        css_styles: {
                            transform: cardCssTransformation(
                                x, y, rot, CARD_WIDTH, CARD_HEIGHT
                            )
                        }
                    }
                });

                if (data.length > 0) {
                    const card_data = data[data.length - 1];
                    card_data.css_class += ' -selectable';
                }
                return data;
            }

        }

    }
</script>
