<template>
    <div
     class="cards-hand-local srsi-cards">
        <div
         v-for="item in cardsItems"
         :key="item.id"
         class="-selectable"
         :style="item.css_styles">
            <img
             :src="item.img_data"/>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import { mapCardsToFlapper } from '../utils';
    import srsi from '../game';

    export default {

        computed: {

            ...mapState(['game_state']),
            ...mapGetters(['cardSizes']),

            cards () {
                if (this.game_state) {
                    return this.game_state.onMovePlayerCards();
                } else {
                    return [];
                }
            },

            cardsItems () {
                return mapCardsToFlapper(
                    this.cards, this.cardSizes.regular,
                    (card, transform) => ({
                        id: card.id,
                        img_data: srsi.images[card.id],
                        css_styles: { transform }
                    })
                );
            }

        },

    }

</script>
