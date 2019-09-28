const { cards } = require('./cards');
const State = require('./state');

class Game {

    constructor (players, local_player_index) {
        this.state = State.empty.duplicate();
        this.players = players;
        this.local_player = this.players[local_player_index];
        players.forEach((p, i) => p.joinGame(this, i));
    }

    begin (deck) {
        let state = State.empty.duplicate();
        state.deck = (deck === undefined) ? cards.createNewShuffledDeck() : deck;
        for (let i=0; i<this.players.length; i+=1) {
            state.players[i] = state.deck.splice(0, 10);
        }
        state.pile = state.deck.splice(0, 1);
        state.on_move = 0;
        this.setState(state);
    }

    setState (state, player, move) {
        this.state = state;
        if (this.history !== undefined) {
            this.history.push(
                state,
                player && player.index,
                move && move.serialize()
            );
        }
        this.invokeEvent('state_changed', player, state);
    }

    playerMoves (player, move) {
        if (this.state.on_move !== player.index) {
            this.invokeEvent('out_of_order', player);
            return;
        }

        move.evaluate(this.state);
        if (move.valid) {
            this.invokeEvent('moved', player, move);
            this.setState(move.applyTo(this.state), player);

        } else {
            this.invokeEvent('bad_move', player, move);

        }
    }

    invokeEvent (name, ...args) {
        setTimeout(() => {
            this.players.forEach(p => p.invoke(name, ...args));
        }, 0);
    }

    remotePlayers () {
        return this.local_player.others();
    }
}

module.exports = Game;
