<template>
    <div
     class="cards-hand-local">
        <div
         v-for="(data, index) in cardsModelView"
         :key="index"
         class="srsi-card -selectable"
         :style="data.css_styles"/>
    </div>
</template>

<script>
    import randString from 'crypto-random-string';
    import colorspace from 'colorspace';
    import times from 'lodash/times';
    import { getResponsiveConst, cardCssTransformation } from '../utils';

    const CARD_WIDTH = getResponsiveConst('card.regular.width');
    const CARD_HEIGHT = getResponsiveConst('card.regular.height');

    export default {

        data () {
            return {
                cards: times(12, () => this.createCard()),
            };
        },

        computed: {

            cardsModelView () {
                const cards = [], cards_data = this.cards;
                const len = cards_data.length;
                const middle = (len-1) / 2;
                const rel_stance_base = middle / len;

                const proportional_x_shift = 11.0 / (13.0 + len) * 0.6 * CARD_WIDTH;

                for (let i=0; i<len; i+=1) {
                    const rel_stance = (i - middle) / len;
                    const stance = i - middle;

                    const data = {
                        card: cards_data[i],
                    };

                    const x = proportional_x_shift * stance;
                    const y = 0.4 * CARD_HEIGHT * (Math.abs(rel_stance) - rel_stance_base) + 0.1 * CARD_HEIGHT;
                    const rot = 0.2 * rel_stance;
                    data['css_styles'] = {
                        backgroundColor: data.card.color,
                        transform: cardCssTransformation(x, y, rot, CARD_WIDTH, CARD_HEIGHT)
                    };

                    cards[i] = data;
                }

                return cards;
            }

        },

        methods: {

            createCard () {
                const color = colorspace(randString({length: 10, type: 'base64'}));
                const card = new Card(color);
                Object.freeze(card);
                return card;
            }

        }

    }

    class Card {

        constructor (color) {
            this.color = color;
        }

        transformProperty () {

        }

    }

</script>
