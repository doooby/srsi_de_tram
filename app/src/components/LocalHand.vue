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

            ...mapState(['session']),
            ...mapGetters(['textGet', 'inSession', 'localPlayerOnTurn']),

            cards () {
                if (this.inSession) {
                    const { game, state } = this.session;
                    const local = game.local_player.index;
                    return state.players[local];
                } else {
                    return [];
                }
            },

            cardsItems () {
                return mapCardsToFlapper(
                    this.cards,
                    platform.card_regular_size,
                    (card, transform) => ({
                        id: card.id,
                        img_data: platform.getImageData(card.id),
                        css_styles: { transform }
                    })
                );
            },

            canQueer () {
                return this.localPlayerOnTurn &&
                    this.session.state.queer === true;
            },

            canLay () {
                return this.localPlayerOnTurn &&
                    !this.canQueer;
            },

            canNothing () {
                if (this.localPlayerOnTurn) {
                    const state = this.session.state;
                    return state.continuance &&
                        state.realPileCard().rank === cards.ACE;
                }
            }

        },

        methods: {

            allSuits () { return cards.SUITS; },
            suitCssClass (suit) { return suitCssClass(suit); },
            transcribe (suit) { return transcribeCard(suit); },

            layCard (index) {
                if (!this.canLay) return;
                this.session.game.local_player.makeMove('lay', index);
            },

            queerSelect (suit) {
                this.session.game.local_player.makeMove('queer', suit);
            },

            doNothing () {
                this.session.game.local_player.makeMove('no');
            }

        },

    }

</script>
