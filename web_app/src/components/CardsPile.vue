<template>
    <div
     class="cards-pile">
        <div
         v-for="position in cards_positions"
         :key="position.card.id"
         class="srsi-card"
         :style="position.css_styles"/>
    </div>
</template>

<script>
    import randString from 'crypto-random-string';
    import colorspace from 'colorspace';
    import times from 'lodash/times';
    import { getResponsiveConst, cardCssTransformation, spreadInsideCircle } from '../utils';

    const CARD_WIDTH = getResponsiveConst('card.regular.width');
    const CARD_HEIGHT = getResponsiveConst('card.regular.height');
    const CARDS_SPREAD_RADIUS = 0.35 * CARD_WIDTH;

    export default {

        data () {
            return {
                cards_positions: times(20, (i) =>
                    new Position({id: i},CARDS_SPREAD_RADIUS)
                ),
            };
        }

    }

    class Position {

        constructor (card, spread) {
            this.card = card;

            const [x, y] = spreadInsideCircle(spread, (Math.random() * 2 * Math.PI));
            const rot = Math.random() * 2;

            this.css_styles = {
                backgroundColor: colorspace(randString({length: 10, type: 'base64'})),
                transform: cardCssTransformation(x, y, rot, CARD_WIDTH, CARD_HEIGHT)
            };
        }

    }

</script>
