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
    import { mapState , mapGetters} from 'vuex';
    import { cardCssTransformation, spreadInsideCircle } from '../utils';
    import srsi from '../game';

    export default {

        data () {
            return {
                card_bg: srsi.images.back,
            };
        },

        computed: {

            ...mapState(['game_state']),
            ...mapGetters(['cardSizes']),

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
                        0.06 * this.cardSizes.regular[0],
                        (Math.random() * 2 * Math.PI)
                    );
                    const rot = (Math.random() - 0.5) * 0.04;

                    return {
                        id: card.id,
                        css_class: '',
                        css_styles: {
                            transform: cardCssTransformation(
                                x, y, rot, ...this.cardSizes.regular
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
