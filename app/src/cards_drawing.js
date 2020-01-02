import { cards, transcriptions } from 'GAME_PATH/src/cards';

const IMAGES = {};

export default class CardsDrawing {

    constructor (app) {
        this.app = app;
        const { font_size, card_size } = app.options;

        this.font_size = font_size;

        const card_sizes = CardsDrawing.cardSizes(card_size);
        this.card_regular_size = card_sizes.regular;
        this.card_small_size = card_sizes.small;
    }

    cardCssTransformation (x, y, rot, width, height) {
        x = ((x - (.5 * width)) / this.font_size).toFixed(2);
        y = ((y - (.5 * height)) / this.font_size).toFixed(2);
        rot = (rot * Math.PI).toFixed(4);
        return `translateX(${x}em) translateY(${y}em) rotate(${rot}rad)`;
    }

    mapCardsToFlapper (cards, size, mapper) {
        const [card_width, card_height] = size;
        const count = cards.length;

        const middle = (count - 1) / 2;
        const rel_stance_base = middle / count;

        const prop_x_shift = 11.0 / (13.0 + count) * 0.6 * card_width;

        return cards.map((card, i) => {
            const stance = i - middle;
            const rel_stance = (i - middle) / count;

            const x = prop_x_shift * stance;
            const y = 0.4 * card_height * (Math.abs(rel_stance) - rel_stance_base)
                + 0.1 * card_height;
            const rot = 0.2 * rel_stance;

            const transform = this.cardCssTransformation(
                x, y, rot, card_width, card_height
            );
            return mapper(card, transform);
        });
    }

    spreadInsideCircle (radius, angle) {
        return [
            (Math.cos(angle) * radius * Math.random()),
            (Math.sin(angle) * radius * Math.random()),
        ];
    }

    transcribeCard (card_value) {
        return transcriptions[card_value];
    }

    suitCssClass (suit) {
        return transcriptions.isRed(suit) ?
            'suit -red' :
            'suit'
            ;
    }

    getImageData (card_id) {
        return IMAGES[card_id];
    }

    static cardSizes (normal_size) {
        return {
            regular: normal_size.map(a => a * 20),
            small: normal_size.map(a => a * 8),
        };
    }

    static async buildCardsImages (width, height) {
        const w_2 = width / 2;
        const h_2 = height / 2;
        const margin = Math.ceil(height / 30);

        cards.forEach(card => {
            const canvas = document.createElement('CANVAS');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = card.isRed() ? 'red' : 'black';
            ctx.textAlign = 'start';
            ctx.textBaseline = 'top';
            const text = card.transcription();

            let font = Math.ceil(height / 3.5);
            ctx.font = `${font}px serif`;
            ctx.fillText(
                text,
                w_2 - ctx.measureText(text).width / 2,
                h_2 - font / 2
            );

            font = Math.ceil(height / 9);
            ctx.font = `${font}px serif`;
            ctx.fillText(text, margin, margin, width);
            ctx.translate(w_2, h_2);
            ctx.rotate(Math.PI);
            ctx.translate(-w_2, -h_2);
            ctx.fillText(text, margin, margin, width);

            IMAGES[card.id] = canvas.toDataURL();
        });

        IMAGES['back'] = (function () {
            const canvas = document.createElement('CANVAS');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            const margin = Math.ceil(height / 11);
            ctx.fillStyle = 'gray';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = 'lightgray';
            ctx.fillRect(margin, margin, width - 2*margin, height - 2*margin);

            ctx.fillStyle = 'gray';
            let font = Math.ceil(height / 6);
            ctx.font = `${font}px serif`;
            let y_base = h_2 - font / 2;
            [ 'SRŠÍ', 'DE', 'TRAM' ].forEach((text, i) => ctx.fillText(
                text,
                w_2 - ctx.measureText(text).width / 2,
                y_base + i * font
            ));

            return canvas.toDataURL();
        }());
    }

}
