<template>
    <div
     class="cards-hand-local center-child">
        <div
         class="srsi-cards">
            <div
             v-for="(item, index) in cardsItems"
             :key="item.id"
             :class="canLay ? '-selectable' : ''"
             :style="item.css_styles"
             @click="layCard(index)">
                <img
                 :src="item.img_data"/>
            </div>
        </div>

        <div
         v-if="canQueer"
         class="floating-label">
            <div
             v-for="suit in allSuits()"
             :key="suit"
             class="button"
             @click="queerSelect(suit)">
                <span
                 :class="suitCssClass(suit)">
                    {{transcribe(suit)}}
                </span>
            </div>
        </div>

        <div
         v-if="canNothing"
         class="floating-label">
            <div
             class="button"
             @click="doNothing()">
                {{textGet('actions.stay')}}
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import { mapCardsToFlapper, suitCssClass, transcribeCard } from '../utils';
    import { cards } from 'GAME_PATH/src/cards';
    import platform from '../platform';

    export default {

        computed: {

            ...mapState(['game', 'game_state']),
            ...mapGetters(['cardSizes', 'textGet', 'localPlayerOnTurn']),

            sessionOn () {
                return this.game &&this.game_state && this.game_state.on_move !== -1;
            },

            cards () {
                if (this.sessionOn) {
                    const local = this.game.local_player.index;
                    return this.game_state.players[local];
                } else {
                    return [];
                }
            },

            cardsItems () {
                return mapCardsToFlapper(
                    this.cards,
                    this.cardSizes.regular,
                    (card, transform) => ({
                        id: card.id,
                        img_data: platform.getImageData(card.id),
                        css_styles: { transform }
                    })
                );
            },

            canQueer () {
                return this.localPlayerOnTurn &&
                    this.game_state.queer === true;
            },

            canLay () {
                return this.localPlayerOnTurn &&
                    !this.canQueer;
            },

            canNothing () {
                const state = this.game_state;
                return this.localPlayerOnTurn &&
                    ( state.continuance &&
                        state.realPileCard().rank === cards.ACE
                    );
            }

        },

        methods: {

            allSuits () { return cards.SUITS; },
            suitCssClass (suit) { return suitCssClass(suit); },
            transcribe (suit) { return transcribeCard(suit); },

            layCard (index) {
                if (!this.canLay) return;
                this.game.local_player.makeMove('lay', index);
            },

            queerSelect (suit) {
                this.game.local_player.makeMove('queer', suit);
            },

            doNothing () {
                this.game.local_player.makeMove('no');
            }

        },

    }

</script>
