<template>
    <div
     class="cards-pile center-child">
        <div
         class="srsi-cards">
            <div
             v-for="card in cards"
             :key="card.id"
             :style="card.css_styles">
                <img
                 :src="card.img_data"/>
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

        data () {
            return {
                cards: []
            }
        },

        watch: {
            pile (new_pile) {
                if (new_pile.length === 0) this.cards = [];

                if (this.cards.length > 0 &&
                    this.cards[0].id !== new_pile[0].id)
                {
                    this.cards.length = 0;
                }

                for (let i=this.cards.length; i<new_pile.length; i+=1) {
                    const card = new_pile[i];
                    const [x, y] = spreadInsideCircle(
                        0.35 * this.cardSizes.regular[0],
                        (Math.random() * 2 * Math.PI)
                    );
                    const rot = Math.random() * 2;
                    this.cards.push({
                        id: card.id,
                        img_data: srsi.cardImage(card.id),
                        css_styles: {
                            transform: cardCssTransformation(
                                x, y, rot, ...this.cardSizes.regular
                            )
                        }
                    });
                }
            }
        },

        computed: {

            ...mapState(['game', 'game_state']),
            ...mapGetters(['cardSizes', 'textGet']),

            pile () {
                if (this.game_state) {
                    return this.game_state.pile;
                } else {
                    return [];
                }
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
