import { cards } from '../../game/src/card';
import Game from '../../game/src/game';
import Player from '../../game/src/player';
import {
    DrawMove,
    LayMove,
    QueerMove,
    NoMove
} from '../../game/src/move';

const moves = {
    draw () { return new DrawMove(); },
    lay (card_index) { return new LayMove(card_index); },
    queer (suit) { return new QueerMove(suit); },
    no () { return new NoMove(); }
};

const images = (function () {
    const [width, height] = [182, 260];
    const w_2 = width / 2;
    const h_2 = height / 2;
    const margin = Math.ceil(height / 30);

    const index = {};

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

        index[card.id] = canvas.toDataURL();
    });

    index['back'] = (function () {
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

    return index;
}());

export default {
    cards,
    images,
    Game,
    Player,
    moves
};
