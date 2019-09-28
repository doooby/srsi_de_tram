import {cards} from './cards';

export class Moves {

    constructor () {
        this.valid = true;
    }

}

const moves = {
    draw () { return new DrawMove(); },
    lay (card_index) { return new LayMove(card_index); },
    queer (suit) { return new QueerMove(suit); },
    no () { return new NoMove(); }
};

export function createMove (name, ...args) {
    return moves[name](...args);
}

Moves.parse = function (data) {
    if (typeof data === 'object') switch (data.m) {
        case 'd':
            return new DrawMove();

        case 'l':
            return new LayMove(data.c);

        case 'q':
            return new QueerMove(data.s);

        case 'n':
            return new NoMove();
    }
};

export class DrawMove extends Moves {

    serialize () {
        return {m: 'd'};
    }

    evaluate (state) {
        if (state.continuance && state.queer === true) {
            this.error = 'queer';
            this.valid = false;
            return;
        }

        if (state.continuance && state.pileCard().rank === cards.ACE) {
            this.error = 'ace';
            this.valid = false;
            return;
        }

        let attack = state.attack, eights = state.eights, to_take = 1;
        if (attack > 0) to_take = attack;
        else if (eights > 0) to_take = eights;

        if (to_take > state.cardsLeftToTake()) {
            this.error = 'not_enough_cards';
            this.valid = false;
        }
    }

    applyTo (state) {
        state = state.duplicate();
        state.continuance = false;
        state.queer = null;

        let attack = state.attack, eights = state.eights, to_take = 1;
        if (attack > 0) {
            to_take = attack;
            state.attack = 0;
        }
        else if (eights > 0) {
            to_take = eights;
            state.continuance = true;
            state.eights = 0;
        }

        let left_in_pile = state.pile.length - 1;
        if (to_take >= state.deck.length && left_in_pile > 0) {
            state.deck = state.deck.concat(state.pile.splice(0, left_in_pile));
        }
        state.players[state.on_move] = state.players[state.on_move].concat(state.deck.splice(0, to_take));
        state.toNextPlayer();

        return state;
    }

}

export class LayMove extends Moves {

    constructor (card_index) {
        super();
        this.card_index = card_index;
    }

    serialize () {
        return {m: 'l', c: this.card_index};
    }

    evaluate (state) {
        if (state.continuance && state.queer === true) {
            this.error = 'queer';
            this.valid = false;
            return;
        }

        let card = state.onMovePlayerCards()[this.card_index], pile = state.pileCard();

        if (state.attack > 0 && (!card.isAttack() && card.rank !== cards.TEN)) {
            this.error = 'attack';
            this.valid = false;
            return;
        }

        if (state.continuance && pile.rank === cards.ACE && card.rank !== cards.ACE) {
            this.error = 'ace';
            this.valid = false;
            return;
        }

        if (pile.rank === cards.TEN && card.isAttack()) {
            this.error = 'attack_on_ten';
            this.valid = false;
            return;
        }

        if (card.suit === pile.suit || card.rank === pile.rank || pile.suit === cards.JOKER ||
            card.suit === cards.JOKER || card.rank === cards.JACK) {

            if (card.rank === cards.ACE && state.onMovePlayerCards().length === 1) {
                this.error = 'ace_end';
                this.valid = false;
                return;
            }

            else if (state.eights > 0 && card.rank !== cards.EIGHT) {
                this.error = 'eights';
                this.valid = false;

            }

            return;
        }

        this.error = 'no_match';
        this.valid = false;
    }

    applyTo (state) {
        state = state.duplicate();
        let card = state.players[state.on_move].splice(this.card_index, 1)[0];
        state.pile.push(card);

        let attack = state.attack, eights = state.eights;
        state.continuance = true;
        state.queer = null;
        let end_of_move = true;

        switch (card.rank) {

            case cards.SEVEN:
                state.attack = attack + 2;
                break;

            case cards.EIGHT:
                state.eights = eights + 1;
                end_of_move = false;
                break;

            case cards.TEN:
                state.attack = 0;
                break;

            case cards.QUEEN:
                state.queer = true;
                end_of_move = false;
                break;

            case cards.KING:
                state.attack = attack + (card.suit === cards.LEAVES ? 4 : 0);
                break;

            case cards.JOKER:
                state.attack = attack + 5;
                break;
        }
        if (end_of_move) state.toNextPlayer();

        return state;
    }

}

export class QueerMove extends Moves {

    constructor (suit) {
        super();
        this.suit = suit ? suit : null;
    }

    serialize () {
        return {m: 'q', s: this.suit};
    }

    evaluate (state) {
        if (state.queer !== true) {
            this.error = 'no_queen';
            this.valid = false;
        }
    }

    applyTo (state) {
        state = state.duplicate();
        state.queer = this.suit;
        state.continuance = true;
        state.toNextPlayer();
        return state;
    }

}

export class NoMove extends Moves {

    serialize () {
        return {m: 'n'};
    }

    evaluate (state) {
        if (state.continuance && state.queer) {
            this.error = 'queer';
            this.valid = false;
            return;
        }

        if (state.continuance && state.pileCard().rank === cards.ACE) {
            return;
        }

        this.error = 'nothing';
        this.valid = false;
    }

    applyTo (state) {
        state = state.duplicate();
        state.continuance = false;
        state.toNextPlayer();
        return state;
    }

}