<template>
    <div
     class="cards-pile srsi-cards">
        <div
         v-for="item in cardsItems"
         :key="item.id"
         :style="item.css_styles">
            <img
             :src="item.img_data"/>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { getResponsiveConst, cardCssTransformation, spreadInsideCircle } from '../utils';
    import srsi from '../game';

    const CARD_WIDTH = getResponsiveConst('card.regular.width');
    const CARD_HEIGHT = getResponsiveConst('card.regular.height');
    const CARDS_SPREAD_RADIUS = 0.35 * CARD_WIDTH;

    export default {

        computed: {

            ...mapState([
                'game_state'
            ]),

            cards () {
                if (this.game_state) {
                    return this.game_state.pile;
                } else {
                    return [];
                }
            },

            cardsItems () {
                return this.cards.map(card => {

                    const [x, y] = spreadInsideCircle(
                        CARDS_SPREAD_RADIUS,
                        (Math.random() * 2 * Math.PI)
                    );
                    const rot = Math.random() * 2;

                    return {
                        id: card.id,
                        img_data: srsi.images[card.id],
                        css_styles: {
                            transform: cardCssTransformation(
                                x, y, rot, CARD_WIDTH, CARD_HEIGHT
                            )
                        }
                    }
                });
            }

        }

    }

</script>
