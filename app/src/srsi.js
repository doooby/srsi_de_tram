import { cards, transcriptions } from 'GAME_PATH/src/cards';
import Game from 'GAME_PATH/src/game';
import Player from 'GAME_PATH/src/player';
import SimpleAi from 'GAME_PATH/src/simple_ai';
import platform from './platform';

function transcribe (card_value) {
    return transcriptions[card_value];
}

function suitCssClass (suit) {
    return transcriptions.isRed(suit) ?
        'suit -red' :
        'suit'
    ;
}

function cardImage (card_id) {
    return platform.getImageData(card_id);
}

export default {
    cards,
    cardImage,
    Game,
    Player,
    SimpleAi,
    transcribe,
    suitCssClass,
};
