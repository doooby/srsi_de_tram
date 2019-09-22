class Card {

    constructor (id) {
        this.id = id;
        this.suit = id & 0xf0;
        this.rank = id & 0x0f;
    }

    isAttack () {
        return this.rank === cards.SEVEN ||
            this.rank === cards.KING ||
            this.rank === cards.JOKER;
    }

    transcription () {
        if (this.id === cards.JOKER) return transcriptions[cards.JOKER];
        else return `${transcriptions[this.suit]}${transcriptions[this.rank]}`;
    }

    isRed () {
        return transcriptions.isRed(this.suit);
    }

}

const cards = [];

// suits
cards.HEARTS = 0x10;  // 16 ♥
cards.BELLS  = 0x20;  // 32 ♦
cards.ACORNS = 0x30;  // 48 ♣
cards.LEAVES = 0x40;  // 64 ♠

// ranks
cards.SEVEN  = 0x7;
cards.EIGHT  = 0x8;
cards.NINE   = 0x9;
cards.TEN    = 0xA;
cards.JACK   = 0xB;
cards.QUEEN  = 0xC;
cards.KING   = 0xD;
cards.ACE    = 0xE;

// joker
cards.JOKER = 0x0;

// suits
cards.SUITS = Object.freeze([
    cards.HEARTS,
    cards.BELLS,
    cards.ACORNS,
    cards.LEAVES
]);

// ranks
cards.RANKS = Object.freeze([
    cards.SEVEN,
    cards.EIGHT,
    cards.NINE,
    cards.TEN,
    cards.JACK,
    cards.QUEEN,
    cards.KING,
    cards.ACE
]);

// the whole deck of cards
cards.push(new Card(cards.JOKER));
cards.SUITS.forEach(function (suit) {
    cards.RANKS.forEach(function (rank) {
        const card = new Card(suit | rank);
        Object.freeze(card);
        cards.push(card);
    });
});

const transcriptions = {};
transcriptions[cards.HEARTS] = '♥'; // "\u2665"
transcriptions[cards.BELLS] = '♦'; // "\u2666"
transcriptions[cards.ACORNS] = '♣'; // "\u2663"
transcriptions[cards.LEAVES] = '♠'; // "\u2660"
transcriptions[cards.SEVEN] = 'Ⅶ'; // "\u2166"
transcriptions[cards.EIGHT] = 'Ⅷ'; // "\u2167"
transcriptions[cards.NINE] = 'Ⅸ'; // "\u2168"
transcriptions[cards.TEN] = 'Ⅹ'; // "\u2169"
transcriptions[cards.JACK] = 'J';
transcriptions[cards.QUEEN] = 'Q';
transcriptions[cards.KING] = 'K';
transcriptions[cards.ACE] = 'A';
transcriptions[cards.JOKER] = 'JOKER';
transcriptions.isRed = function (suit) {
    return suit === cards.HEARTS || suit === cards.BELLS;
};

cards.createNewShuffledDeck = function () {
    let i, j = 0, temp = null, array = cards.slice();
    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp
    }
    return array;
};

cards.index = cards.reduce((memo, card) => {
        memo[card.id] = card;
        return memo;
    },
    {}
);

Object.freeze(cards);
Object.freeze(transcriptions);
export {Card, cards, transcriptions};
