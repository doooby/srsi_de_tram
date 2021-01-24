<template>
    <div
     class="cards-deck srsi-cards">
        <div
         v-for="card in reversedCards"
         :key="card.id"
         :class="isPlayable(card.id) ? '-selectable' : ''"
         :style="card.css_styles"
         @click="drawCards()">
            <img
             :src="card_bg"/>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import { cards } from 'GAME_PATH/src/cards';

    export default {

        data () {
            return {
                card_bg: this.$app.cards_drawing.getImageData('back'),
                cards: []
            };
        },

        watch: {
            deck (new_deck) {
                if (new_deck.length === 0) this.cards = [];

                if (this.cards.length === 0 ||
                    this.cards[this.cards.length-1].id !== new_deck[new_deck.length-1].id)
                {
                    this.cards.length = 0;
                    const drawing = this.$app.cards_drawing;

                    for (let i=this.cards.length; i<new_deck.length; i+=1) {
                        const card = new_deck[i];
                        const [x, y] = drawing.spreadInsideCircle(
                            0.06 * drawing.card_regular_size[0],
                            (Math.random() * 2 * Math.PI)
                        );
                        const rot = (Math.random() - 0.5) * 0.04;
                        this.cards.push({
                            id: card.id,
                            css_styles: {
                                transform: drawing.cardCssTransformation(
                                    x, y, rot, ...drawing.card_regular_size
                                )
                            }
                        });
                    }
                }

                const removed_count = this.cards.length - new_deck.length;
                this.cards.splice(0, removed_count);
            }
        },

        computed: {

            ...mapState(['session']),
            ...mapGetters(['localPlayerOnTurn']),

            deck () {
                const { state } = this.session;
                return state ? state.deck : [];
            },

            reversedCards () {
                const arr = [];
                for (let i=this.cards.length-1; i>=0; i-=1) {
                    arr.push(this.cards[i]);
                }
                return arr;
            },

            nextCard () {
                return this.deck[0];
            },

            canDraw () {
                const { state } = this.session;
                return this.localPlayerOnTurn &&
                    state.queer !== true &&
                    !( state.continuance &&
                        state.realPileCard().rank === cards.ACE
                    );
            }

        },

        methods: {

            isPlayable (card_id) {
                return this.canDraw && this.nextCard.id === card_id;
            },

            drawCards () {
                if (!this.canDraw) return;
                this.session.game.local_player.makeMove('draw');
            }

        }

    }
</script>
