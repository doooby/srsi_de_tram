<template>
    <div
     class="cards-hand-local">
        <div
         v-for="record in cardsModelView"
         :key="record.card.id"
         class="srsi-card -selectable"
         :style="record.css_styles">
            <img
             :src="record.img_data"/>
        </div>
    </div>
</template>

<script>
    import { getResponsiveConst, cardCssTransformation } from '../utils';
    import * as srsi from '../game';

    const CARD_WIDTH = getResponsiveConst('card.regular.width');
    const CARD_HEIGHT = getResponsiveConst('card.regular.height');

    export default {

        data () {
            const deck = srsi.cards.createNewShuffledDeck();
            return {
                cards: deck
            };
        },

        computed: {

            cardsModelView () {
                const model_view = [], cards_data = this.cards;
                const len = cards_data.length;
                const middle = (len-1) / 2;
                const rel_stance_base = middle / len;

                const proportional_x_shift = 11.0 / (13.0 + len) * 0.6 * CARD_WIDTH;

                for (let i=0; i<len; i+=1) {
                    const rel_stance = (i - middle) / len;
                    const stance = i - middle;

                    const x = proportional_x_shift * stance;
                    const y = 0.4 * CARD_HEIGHT * (Math.abs(rel_stance) - rel_stance_base) + 0.1 * CARD_HEIGHT;
                    const rot = 0.2 * rel_stance;

                    const card = cards_data[i];
                    model_view[i] = {
                        card,
                        img_data: srsi.images[card.id],
                        css_styles: {
                            transform: cardCssTransformation(
                                x, y, rot, CARD_WIDTH, CARD_HEIGHT
                            )
                        }
                    };
                }

                return model_view;
            }

        },

    }

</script>
