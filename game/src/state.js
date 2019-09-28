import {Card, cards} from './cards';
import { LayMove } from './moves';

export default class State {

    constructor (state) {
        this.deck = state.deck.slice();
        this.pile = state.pile.slice();
        this.players = state.players.map(p => p.slice());
        this.on_move = state.on_move;
        this.continuance = state.continuance;
        this.attack = state.attack;
        this.eights = state.eights;
        this.queer = state.queer;
    }

    duplicate () {
        return new State(this);
    }

    toNextPlayer () {
        let next = this.on_move + 1;
        if (next >= this.players.length) next = 0;
        this.on_move = next;
    }

    cardsLeftToTake () {
        return this.deck.length + this.pile.length - 1;
    }

    onMovePlayerCards () {
        return this.players[this.on_move];
    }

    realPileCard () {
        return this.pile[this.pile.length - 1];
    }

    pileCard () {
        if (this.pile_card === undefined) {
            let real = this.realPileCard();
            let queer_suit = this.queerSelected();
            return queer_suit ? new Card(queer_suit | real.rank) : real;
        }
        return this.pile_card;
    }

    queerSelected () {
        return (typeof this.queer === 'number') ? this.queer : false;
    }

    playerWon () {
        if (this.winner === undefined) {
            if (this.onMovePlayerCards().length === 0 &&
                this.queer === null &&
                this.attack === 0 &&
                this.eights === 0) {
                this.winner = this.on_move;

            } else {
                this.winner = null;

            }
        }
        return this.winner;
    }

    possibleActions () {
        if (this.queer === true) return ['queer'];
        else if (this.eights > 0) return ['eights', 'lay'];

        let passive = 'draw';
        if (this.continuance) {
            if (this.pileCard().rank === cards.ACE) passive = 'stay';
            else if (this.attack > 0) passive = 'devour';
        }
        let hand = this.onMovePlayerCards();
        let last_is_ace = hand.length === 1 && hand[0].rank === cards.ACE;

        return last_is_ace ? [passive] : [passive, 'lay'];
    }

    possibleToLay () {
        const hand_size = this.onMovePlayerCards().length;
        const possible = [];

        for (let i=0; i<hand_size; i+=1) {
            const move = new LayMove(i);
            move.evaluate(this);
            if (move.valid) possible.push(i);
        }

        return possible;
    }

}

State.empty = new State({
    deck: [],
    pile: [],
    players: [],
    on_move: -1,
    continuance: false,
    attack: 0,
    eights: 0,
    queer: null
});

State.at = function (options) {
    let state = State.empty.duplicate();
    if (typeof options !== 'object') return state;

    ['deck', 'pile', 'players', 'continuance', 'attack', 'queer', 'eights'].forEach(a => {
        if (options[a]) state[a] = options[a];
    });

    let on_move = options['on_move'];
    if (on_move === undefined && state.players.length > 0) on_move = 0;
    if (on_move !== undefined) state.on_move = on_move;

    return state;
};
