import {DrawMove, LayMove, NoMove, QueerMove} from './move';
import {cards} from './card';

const EVENTS = ['state_changed', 'moved', 'bad_move', 'out_of_order'];

export default class Player {

    constructor (name) {
        this.name = name;
    }

    joinGame (game, index) {
        this.game = game;
        this.index = index;
    }

    forOthers (fn) {
        this.game.players.forEach(p => {
           if (p !== this) fn(p);
        });
    }

    possibleActions () {
        const state = this.game.state;
        if (state.on_move !== this.index) return [];

        if (state.queer === true) return ['queer'];
        else if (state.eights > 0) return ['draw', 'lay'];

        let passive = 'draw';
        if (state.continuance) {
            if (state.pileCard().rank === cards.ACE) passive = 'stay';
            else if (state.attack > 0) passive = 'devour';
        }
        let player_cards = state.onMovePlayerCards();
        let last_is_ace = player_cards.length === 1 && player_cards[0].rank === cards.ACE;

        return last_is_ace ? [passive] : [passive, 'lay'];
    }

    lay (card_i) {
        return new LayMove(card_i);
    }

    draw () {
        return new DrawMove();
    }

    doNothing () {
        return new NoMove();
    }

    selectQueerSuit (suit) {
        return new QueerMove(suit);
    }

    subscribe (event, fn) {
        if (!EVENTS.includes(event)) throw `undefined event ${event}`;

        const sub = Subscription.fetch(this, event, true);
        sub.add(fn);
        return fn;
    }

    unsubscribe (event, fn) {
        if (!EVENTS.includes(event)) throw `undefined event ${event}`;

        const sub = Subscription.fetch(this, event);
        if (sub) sub.remove(fn);
    }

    invoke (event, ...args) {
        if (!EVENTS.includes(event)) throw `undefined event ${event}`;

        const sub = Subscription.fetch(this, event);
        if (sub) sub.invoke(...args);
    }

}

class Subscription {

    constructor () {
        this.subs = [];
    }

    add (fn) {
        this.subs.push(fn);
    }

    remove (fn) {
        const i = this.subs.indexOf(fn);
        if (i !== -1) this.subs.splice(i, 1);
    }

    invoke (...args) {
        this.subs.forEach(fn => fn(...args));
    }

    static fetch (object, name, create=false) {
        const sub_name = `_sub_${name}`;

        let sub = object[sub_name];
        if (!sub && create) {
            sub = new Subscription();
            object[sub_name] = sub;
        }

        return sub;
    }

}
