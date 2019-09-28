const { cards } = require('./cards');

class SimpleAi {

    constructor () {
        this.events = {
            state_changed: () => {
                const player = this.player;
                if (player.game.state.on_move === player.index) {
                    const move = this.nextMove();
                    setTimeout(
                        () => player.makeMove(...move),
                        1000
                    );
                }
            }
        };
    }

    attach (player) {
        this.player = player;
        return this.actor_model;
    }

    nextMove () {
        const state = this.player.game.state;
        const actions = this.player.possibleActions();
        if (actions.length === 0) throw 'SimpleAI - no possible actions';

        // queer is on
        // just choose
        if (actions.includes('queer')) {
            return ['queer', random_item(cards.SUITS)];
        }

        const hand = state.players[this.player.index];
        const to_lay = state.possibleToLay().map(index => ({
            index,
            card: hand[index]
        }));

        // ace played against
        // return ace
        // or hold
        if (actions.includes('stay')) {
            const aces = to_lay.filter(
                ({card}) => card.rank === cards.ACE
            );

            if (aces.length > 0) {
                return ['lay', random_item(aces).index];

            } else {
                return ['no'];

            }
        }

        // attacked
        // reply with attack card
        // or put a ten
        // or devour
        if (actions.includes('devour')) {
            const attacks = to_lay.filter(
                ({card}) => card.rank === cards.SEVEN ||
                    card.rank === cards.KING ||
                    card.rank === cards.JOKER
            );
            const tens = to_lay.filter(
                ({card}) => card.rank === cards.TEN
            );

            if (attacks.length > 0) {
                return ['lay', random_item(attacks).index];

            } else if (tens.length > 0) {
                return ['lay', random_item(tens).index];

            } else {
                return ['draw'];

            }
        }

        // an eight played
        // gradually lay all eights
        // or draw
        if (actions.includes('eights')) {
            const eights = to_lay.filter(
                ({card}) => card.rank === cards.EIGHT
            );

            if (eights.length > 0) {
                return ['lay', random_item(eights).index];

            } else {
                return ['draw'];

            }
        }

        // regular situation
        // lay or draw
        if (actions.includes('lay') && to_lay.length > 0) {
            return ['lay', random_item(to_lay).index];

        } else {
            return ['draw'];

        }

    }

}

function random_item (array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = SimpleAi;
