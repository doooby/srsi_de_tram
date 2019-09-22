<template>
    <div
     :style="{width: '1200px', height: '450px', border: '2px solid gray'}">
        <div
         class="cards-hand-list">
            <div>
                <div
                 v-for="(data, index) in cardsModelView"
                 :key="index"
                 class="card"
                 :style="data.css_styles">
                    fdsf
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import randString from 'crypto-random-string';
    import colorspace from 'colorspace';
    import times from 'lodash/times';
    import { getResponsiveConst } from '../constants';

    const CARD_WIDTH = getResponsiveConst('cards.hand.width');
    const CARD_HEIGHT = getResponsiveConst('cards.hand.height');
    const CARD_X_PROP_SHIFT = (len) => {
        const mod = 11.0 / (13.0 + len);
        return mod* 0.6 * CARD_WIDTH;
    };
    const CARD_X_SHIFT = (rel_shift, stance) => {
        const shift = rel_shift * stance;
        return shift - (0.5 * CARD_WIDTH);
    };
    const CARD_Y_SHIFT = (rel_stance, base) => {
        const shift = Math.abs(rel_stance) - base;
        return shift * CARD_HEIGHT * 0.3 - (0.5 * CARD_HEIGHT);
    };

    export default {

        data () {
            return {
                cards: times(6, () => this.createCard()),
            };
        },

        computed: {

            cardsModelView () {
                const cards = [], cards_data = this.cards;
                const len = cards_data.length;
                const middle = (len-1) / 2;
                const rel_stance_base = middle / len;

                const proportional_x_shift = CARD_X_PROP_SHIFT(len);

                for (let i=0; i<len; i+=1) {
                    const rel_stance = (i - middle) / len;
                    const stance = i - middle;

                    const data = {
                        card: cards_data[i],
                    };

                    const tx = CARD_X_SHIFT(proportional_x_shift, stance);
                    const ty = CARD_Y_SHIFT(rel_stance, rel_stance_base);
                    const rot = 0.6 * rel_stance;
                    data['css_styles'] = {
                        backgroundColor: data.card.color,
                        transform: `translateX(${tx}px) translateY(${ty}px) rotate(${rot}rad)`
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
