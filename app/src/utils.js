import lib_store from '../lib/constants_store';
import { transcriptions } from 'GAME_PATH/src/cards';

export function getConst (key) {
    return lib_store.getConst(CONSTANTS, key);
}

export function getResponsiveConst (key, media_size) {
    return lib_store.getResponsiveConst(CONSTANTS, key, media_size);
}

export function cardCssTransformation (x, y, rot, width, height) {
    x = Math.ceil(x - 0.5 * width);
    y = Math.ceil(y - 0.5 * height);
    rot = (rot * Math.PI).toFixed(4);
    return `translateX(${x}px) translateY(${y}px) rotate(${rot}rad)`;
}

export function spreadInsideCircle (radius, angle) {
    return [
        (Math.cos(angle) * radius * Math.random()),
        (Math.sin(angle) * radius * Math.random()),
    ];
}

export function mapCardsToFlapper (cards, size, mapper) {
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

        const transform = cardCssTransformation(
            x, y, rot, card_width, card_height
        );
        return mapper(card, transform);
    });
}

export function transcribeCard (card_value) {
    return transcriptions[card_value];
}

export function suitCssClass (suit) {
    return transcriptions.isRed(suit) ?
        'suit -red' :
        'suit'
        ;
}
