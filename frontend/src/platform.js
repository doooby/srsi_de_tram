import { cards } from 'GAME_PATH/src/cards';
import Application from './application';
import CardsDrawing from './cards_drawing';

const PLATFORM_NORMAL_SIZE = [ 3, 2 ];
const PLATFORM_SIZE_MOD = 250;
const CARD_NORMAL_SIZE = [ 7, 10 ];
const APP_FONT_SIZE = 16;
const APP_ICON_SIZE = 24;

const platform = {

    initialized: false,

    async init () {
        if (platform.initialized) return;

        await CardsDrawing.buildCardsImages(
            ...CardsDrawing.cardSizes(CARD_NORMAL_SIZE).regular
        );

        platform.initialized = true;
    },

    defaultOptions () {
        return {
            wh_base: PLATFORM_NORMAL_SIZE,
            size_mod: PLATFORM_SIZE_MOD,
            card_size: CARD_NORMAL_SIZE,
            font_size: APP_FONT_SIZE,
            icon_size: APP_ICON_SIZE,
        }
    },

    async createApp (root, options) {
        await platform.init();
        return new Application(
            root,
            options || platform.defaultOptions()
        );
    },

    newCardsDeck () {
        return cards.createNewShuffledDeck();
    },

    serializeCardsDeck (deck) {
        if (!deck) deck = cards.createNewShuffledDeck();
        return deck.map(c => c.id);
    },

    parseCardsDeck (ids) {
        return ids.map(id => cards.index[id]);
    },

};
export default platform;
