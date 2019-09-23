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
    import { mapState, mapGetters } from 'vuex';
    import { cardCssTransformation, spreadInsideCircle } from '../utils';
    import srsi from '../srsi';

    export default {

        computed: {

            ...mapState(['game', 'game_state']),
            ...mapGetters(['cardSizes']),

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
                        0.35 * this.cardSizes.regular[0],
                        (Math.random() * 2 * Math.PI)
                    );
                    const rot = Math.random() * 2;

                    return {
                        id: card.id,
                        img_data: srsi.images[card.id],
                        css_styles: {
                            transform: cardCssTransformation(
                                x, y, rot, ...this.cardSizes.regular
                            )
                        }
                    }
                });
            }

        }

    }

</script>
