<template>
    <div
     class="cards-pile center-child">
        <div
         class="srsi-cards">
            <div
             v-for="item in cardsItems"
             :key="item.id"
             :style="item.css_styles">
                <img
                 :src="item.img_data"/>
            </div>
        </div>

        <div
         v-if="overlay"
         class="floating-label">
            {{overlay.text}}
            <span
             v-if="overlay.queer"
             :class="suitCssClass(overlay.queer)">
                {{transcribe(overlay.queer)}}
            </span>
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
            ...mapGetters(['cardSizes', 'textGet']),

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
            },

            overlay () {
                if (!this.game_state) return;
                const { attack, queer } = this.game_state;

                if (attack) return {
                    text: this.textGet(
                        'state.attack',
                        { power: String(attack) }
                    )
                };

                if (typeof queer === 'number') return {
                    text: this.textGet(
                        'state.queer',
                        { suit: '' }
                    ),
                    queer
                };
            }

        },

        methods: {

            suitCssClass (suit) { return srsi.suitCssClass(suit); },
            transcribe (suit) { return srsi.transcribe(suit); },

        }

    }

</script>
