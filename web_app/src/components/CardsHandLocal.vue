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
    import { mapState } from 'vuex';
    import { getResponsiveConst, mapCardsToFlapper } from '../utils';
    import srsi from '../game';

    const CARD_WIDTH = getResponsiveConst('card.regular.width');
    const CARD_HEIGHT = getResponsiveConst('card.regular.height');

    export default {

        computed: {

            ...mapState([
                'game_state'
            ]),

            cards () {
                if (this.game_state) {
                    return this.game_state.onMovePlayerCards();
                } else {
                    return [];
                }
            },

            cardsItems () {
                return mapCardsToFlapper(
                    this.cards, [CARD_WIDTH, CARD_HEIGHT],
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
