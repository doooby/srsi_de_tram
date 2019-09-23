<template>
    <div
     class="cards-hand-local srsi-cards">
        <div
         v-for="(item, index) in cardsItems"
         :key="item.id"
         :class="cardsCssClass"
         :style="item.css_styles"
         @click="layCard(index)">
            <img
             :src="item.img_data"/>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import { mapCardsToFlapper } from '../utils';
    import srsi from '../srsi';

    export default {

        computed: {

            ...mapState(['game', 'game_state']),
            ...mapGetters(['cardSizes', 'localPlayerOnTurn']),

            cards () {
                if (this.game && this.game_state) {
                    const local = this.game.local_player.index;
                    return this.game_state.players[local];
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
            },

            cardsCssClass () {
                return this.localPlayerOnTurn ? '-selectable' : '';
            }

        },

        methods: {

            layCard (index) {
                if (!this.localPlayerOnTurn) return;
                this.game.playerMove(
                    this.game.local_player,
                    srsi.moves.lay(index)
                );
            }

        },

    }

</script>
