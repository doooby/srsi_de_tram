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

                const drawing = this.$app.cards_drawing;

                for (let i=this.cards.length; i<new_pile.length; i+=1) {
                    const card = new_pile[i];
                    const [x, y] = drawing.spreadInsideCircle(
                        0.35 * drawing.card_regular_size[0],
                        (Math.random() * 2 * Math.PI)
                    );
                    const rot = Math.random() * 2;
                    this.cards.push({
                        id: card.id,
                        img_data: drawing.getImageData(card.id),
                        css_styles: {
                            transform: drawing.cardCssTransformation(
                                x, y, rot, ...drawing.card_regular_size
                            )
                        }
                    });
                }
            }
        },

        computed: {

            ...mapState(['session']),
            ...mapGetters(['textGet']),

            pile () {
                const { state } = this.session;
                return state ? state.pile : [];
            },

            overlay () {
                const { state } = this.session;
                if (!state) return;

                if (state.attack) return {
                    text: this.textGet(
                        'state.attack',
                        { power: String(state.attack) }
                    )
                };

                if (typeof state.queer === 'number') return {
                    text: this.textGet(
                        'state.queer',
                        { suit: '' }
                    ),
                    queer: state.queer
                };
            }

        },

        methods: {

            suitCssClass (suit) {
                return this.$app.cards_drawing.suitCssClass(suit);
            },

            transcribe (suit) {
                return this.$app.cards_drawing.transcribeCard(suit);
            },

        }

    }

</script>
