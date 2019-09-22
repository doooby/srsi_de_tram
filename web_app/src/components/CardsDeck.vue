<template>
    <div
     class="cards-deck">
        <div
         class="srsi-card -selectable center-child">
            <img
             :src="card_bg"/>
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
            return {
                card_bg: srsi.images.back,
                // count: 36
            };
        },

        computed: {

            // rotated_cards () {
            //     const count = Math.ceil(this.count / 6);
            //
            //     const spread = 0.1 * CARD_WIDTH;
            //
            //     return times(count, () => {
            //         const [x, y] = spreadInsideCircle(
            //             spread,
            //             (Math.random() * 2 * Math.PI)
            //         );
            //         const rot = Math.random() * 2;
            //         return cardCssTransformation(
            //             x, y, rot, CARD_WIDTH, CARD_HEIGHT
            //         );
            //     });
            // }

        }

    }
</script>
