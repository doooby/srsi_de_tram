const { createMove } = require('./moves');

const EVENTS = ['state_changed', 'moved', 'bad_move', 'out_of_order'];

class Player {

    constructor (name) {
        this.name = name;
        this.actor = null;
    }

    joinGame (game, index) {
        this.game = game;
        this.index = index;
    }

    others () {
        return this.game.players.filter(p => this !== p);
    }

    possibleActions () {
        const state = this.game.state;
        if (state.on_move !== this.index) return [];
        else return state.possibleActions();
    }

    makeMove (...args) {
        this.game.playerMoves(this, createMove(...args));
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
        if (sub) sub.invoke(args);
    }

    attachActor (actor) {
        this.actor = actor;
        actor.attach(this);

        const { events } = this.actor;

        if (events) {
            Object.keys(events).forEach(name =>
                this.subscribe(name, events[name])
            );
        }
    }

    detachActor () {
        if (!this.actor) return;
        const { detach, events } = this.actor;

        if (detach) this.actor.detach();

        if (events) {
            Object.keys(events).forEach(name =>
                this.unsubscribe(name, events[name])
            );
        }

        this.actor = null;
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

    invoke (args) {
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

module.exports = Player;
