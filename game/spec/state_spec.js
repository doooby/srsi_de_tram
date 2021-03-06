const { cards, Card } = require('../src/cards');
const { LayMove, DrawMove, NoMove, QueerMove } = require('../src/moves');
const State = require('../src/state');

describe('game rules', () => {

    function calc_cards_diff (former, actual) {
        const count_change = actual.length - former.length;
        if (count_change !== 0) return count_change;

        for (let i=0; i<former.length; i+=1) {
            if (former[i].id !== actual[i].id) return 0;
        }

        return false;
    }

    function state_after_move (state, move) {
        const new_state = move.applyTo(state);

        const diff = {
            deck: calc_cards_diff(state.deck, new_state.deck),
            pile: calc_cards_diff(state.pile, new_state.pile),
            player: calc_cards_diff(state.players[0], new_state.players[0])
        };
        diff.list = [];
        ['deck', 'pile', 'player'].forEach(a => {
            if (diff[a] !== false) diff.list.push(a)
        });
        ['on_move', 'continuance', 'attack', 'eights', 'queer'].forEach(a => {
            if (state[a] !== new_state[a]) diff.list.push(a);
        });

        return {diff, state, new_state};
    }

    describe('lay moves', () => {

        it('simple lay', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    pile: [new Card(cards.LEAVES | cards.NINE)],
                    players: [
                        [new Card(cards.HEARTS | cards.NINE), new Card(cards.ACORNS | cards.NINE)],
                        []
                    ]
                }),
                new LayMove(1)
            );
            expect(diff.pile).toBe(1);
            expect(new_state.pile[1].id).toBe(state.players[0][1].id);
            expect(diff.player).toBe(-1);
            expect(new_state.continuance).toBe(true);
            expect(diff.list).toEqual(['pile', 'player', 'on_move', 'continuance']);
        });

        it('ten clears attack', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    players: [
                        [new Card(cards.HEARTS | cards.TEN)],
                        []
                    ],
                    continuance: true,
                    attack: 5
                }),
                new LayMove(0)
            );
            expect(diff.pile).toBe(1);
            expect(diff.player).toBe(-1);
            expect(new_state.attack).toBe(0);
            expect(diff.list).toEqual(['pile', 'player', 'on_move', 'attack']);
        });

        it('attack with seven', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    players: [
                        [new Card(cards.HEARTS | cards.SEVEN)],
                        []
                    ]
                }),
                new LayMove(0)
            );
            expect(diff.pile).toBe(1);
            expect(diff.player).toBe(-1);
            expect(new_state.continuance).toBe(true);
            expect(new_state.attack).toBe(2);
            expect(diff.list).toEqual(['pile', 'player', 'on_move', 'continuance', 'attack']);
        });

        it('return with king', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    players: [
                        [new Card(cards.HEARTS | cards.KING)],
                        []
                    ],
                    continuance: true,
                    attack: 3
                }),
                new LayMove(0)
            );
            expect(diff.pile).toBe(1);
            expect(diff.player).toBe(-1);
            expect(diff.list).toEqual(['pile', 'player', 'on_move']);
        });

        it('attack with king of leaves', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    players: [
                        [new Card(cards.LEAVES | cards.KING)],
                        []
                    ]
                }),
                new LayMove(0)
            );
            expect(diff.pile).toBe(1);
            expect(diff.player).toBe(-1);
            expect(new_state.continuance).toBe(true);
            expect(new_state.attack).toBe(4);
            expect(diff.list).toEqual(['pile', 'player', 'on_move', 'continuance', 'attack']);
        });

        it('attack with joker', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    players: [
                        [new Card(cards.JOKER)],
                        []
                    ]
                }),
                new LayMove(0)
            );
            expect(diff.pile).toBe(1);
            expect(diff.player).toBe(-1);
            expect(new_state.continuance).toBe(true);
            expect(new_state.attack).toBe(5);
            expect(diff.list).toEqual(['pile', 'player', 'on_move', 'continuance', 'attack']);
        });

    });

    describe('queen move', () => {

        it('lay', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    players: [
                        [new Card(cards.BELLS | cards.QUEEN)],
                        []
                    ],
                    continuance: true
                }),
                new LayMove(0)
            );
            expect(diff.pile).toBe(1);
            expect(diff.player).toBe(-1);
            expect(new_state.continuance).toBe(true);
            expect(new_state.queer).toBe(true);
            expect(diff.list).toEqual(['pile', 'player', 'queer']);
        });

        it('change', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    pile: [new Card(cards.BELLS | cards.QUEEN)],
                    players: [
                        [],
                        []
                    ],
                    continuance: true,
                    queer: true
                }),
                new QueerMove(cards.ACORNS)
            );
            expect(new_state.queer).toBe(cards.ACORNS);
            expect(diff.list).toEqual(['on_move', 'queer']);
        });

        it('change - the same', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    pile: [new Card(cards.BELLS | cards.QUEEN)],
                    players: [
                        [],
                        []
                    ],
                    continuance: true,
                    queer: true
                }),
                new QueerMove(null)
            );
            expect(new_state.queer).toBe(null);
            expect(diff.list).toEqual(['on_move', 'queer']);
        });

        it('lay queen', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    pile: [new Card(cards.HEARTS | cards.NINE)],
                    players: [
                        [new Card(cards.HEARTS | cards.QUEEN)],
                        []
                    ],
                    continuance: true
                }),
                new LayMove(0)
            );
            expect(diff.pile).toBe(1);
            expect(diff.player).toBe(-1);
            expect(new_state.pile[1].id).toBe(state.players[0][0].id);
            expect(new_state.continuance).toBe(true);
            expect(new_state.queer).toBe(true);
            expect(diff.list).toEqual(['pile', 'player', 'queer']);
        });

        it('draw after queen changed', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    deck: [new Card(0)],
                    pile: [new Card(cards.HEARTS | cards.QUEEN)],
                    players: [
                        [],
                        []
                    ],
                    continuance: true,
                    queer: cards.ACORNS
                }),
                new DrawMove()
            );
            expect(diff.pile).toBe(false);
            expect(diff.deck).toBe(-1);
            expect(diff.player).toBe(1);
            expect(new_state.players[0][0].id).toBe(state.deck[0].id);
            expect(new_state.continuance).toBe(false);
            expect(new_state.queer).toBe(null);
            expect(diff.list).toEqual(['deck', 'player', 'on_move', 'continuance', 'queer']);
        });

        it('lay after queen changed', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    deck: [new Card(0)],
                    pile: [new Card(cards.HEARTS | cards.QUEEN)],
                    players: [
                        [new Card(cards.ACORNS | cards.NINE)],
                        []
                    ],
                    continuance: true,
                    queer: cards.ACORNS
                }),
                new LayMove(0)
            );
            expect(diff.pile).toBe(1);
            expect(diff.deck).toBe(false);
            expect(diff.player).toBe(-1);
            expect(new_state.pile[1].id).toBe(state.players[0][0].id);
            expect(new_state.continuance).toBe(true);
            expect(new_state.queer).toBe(null);
            expect(diff.list).toEqual(['pile', 'player', 'on_move', 'queer']);
        });

    });

    describe('eights move', () => {

        it('first eight', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    players: [
                        [new Card(cards.BELLS | cards.EIGHT)],
                        []
                    ],
                    continuance: true
                }),
                new LayMove(0)
            );
            expect(diff.pile).toBe(1);
            expect(diff.player).toBe(-1);
            expect(new_state.eights).toBe(1);
            expect(diff.list).toEqual(['pile', 'player', 'eights']);
        });

        it('first eight - discontinued', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    players: [
                        [new Card(cards.BELLS | cards.EIGHT)],
                        []
                    ]
                }),
                new LayMove(0)
            );
            expect(diff.pile).toBe(1);
            expect(diff.player).toBe(-1);
            expect(new_state.continuance).toBe(true);
            expect(new_state.eights).toBe(1);
            expect(diff.list).toEqual(['pile', 'player', 'continuance', 'eights']);
        });

        it('third eight', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    players: [
                        [new Card(cards.BELLS | cards.EIGHT)],
                        []
                    ],
                    continuance: true,
                    eights: 1
                }),
                new LayMove(0)
            );
            expect(diff.pile).toBe(1);
            expect(diff.player).toBe(-1);
            expect(new_state.eights).toBe(2);
            expect(diff.list).toEqual(['pile', 'player', 'eights']);
        });

        it('take eights', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    deck: [new Card(cards.LEAVES | cards.EIGHT), new Card(cards.BELLS | cards.EIGHT)],
                    pile: [new Card(cards.HEARTS | cards.EIGHT), new Card(cards.ACORNS | cards.EIGHT)],
                    players: [
                        [],
                        []
                    ],
                    continuance: true,
                    eights: 2
                }),
                new DrawMove()
            );
            expect(diff.deck).toBe(-1);
            expect(diff.pile).toBe(-1);
            expect(diff.player).toBe(2);
            expect(new_state.eights).toBe(0);
            expect(diff.list).toEqual(['deck', 'pile', 'player', 'on_move', 'eights']);
        });

        it('take four eights', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    deck: [
                        new Card(cards.LEAVES | cards.NINE),
                        new Card(cards.BELLS | cards.NINE),
                        new Card(cards.LEAVES | cards.TEN),
                        new Card(cards.BELLS | cards.TEN),
                    ],
                    players: [
                        [],
                        []
                    ],
                    continuance: true,
                    eights: 4
                }),
                new DrawMove()
            );
            expect(diff.deck).toBe(-4);
            expect(new_state.players[1].length).toBe(4);
            expect(new_state.eights).toBe(0);
            expect(diff.list).toEqual(['deck', 'on_move', 'eights']);
        });

    });

    describe('passive moves', () => {

        it('draw', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    deck: [new Card(cards.BELLS | cards.EIGHT), new Card(cards.ACORNS | cards.NINE)],
                    players: [
                        [],
                        []
                    ],
                    continuance: true
                }),
                new DrawMove()
            );
            expect(diff.deck).toBe(-1);
            expect(diff.player).toBe(1);
            expect(new_state.players[0][0].id).toBe(state.deck[0].id);
            expect(new_state.continuance).toBe(false);
            expect(diff.list).toEqual(['deck', 'player', 'on_move', 'continuance']);
        });

        it('draw with pile turn-over', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    pile: [new Card(cards.BELLS | cards.EIGHT), new Card(cards.ACORNS | cards.NINE)],
                    players: [
                        [],
                        []
                    ],
                    continuance: true
                }),
                new DrawMove()
            );
            expect(diff.pile).toBe(-1);
            expect(diff.player).toBe(1);
            expect(new_state.players[0][0].id).toBe(state.pile[0].id);
            expect(new_state.continuance).toBe(false);
            expect(diff.list).toEqual(['pile', 'player', 'on_move', 'continuance']);
        });

        it('draw after attack', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    deck: [new Card(cards.LEAVES | cards.EIGHT), new Card(cards.BELLS | cards.EIGHT),
                        new Card(cards.HEARTS | cards.EIGHT)],
                    players: [
                        [],
                        []
                    ],
                    continuance: true,
                    attack: 2
                }),
                new DrawMove()
            );
            expect(diff.deck).toBe(-2);
            expect(diff.player).toBe(2);
            expect(new_state.players[0][0].id).toBe(state.deck[0].id);
            expect(new_state.players[0][1].id).toBe(state.deck[1].id);
            expect(new_state.continuance).toBe(false);
            expect(new_state.attack).toBe(0);
            expect(diff.list).toEqual(['deck', 'player', 'on_move', 'continuance', 'attack']);
        });

        it('nothing after ace', () => {
            const {diff, state, new_state} = state_after_move(State.at({
                    deck: [new Card(cards.HEARTS | cards.EIGHT)],
                    pile: [new Card(cards.LEAVES | cards.ACE)],
                    players: [
                        [],
                        []
                    ]
                }),
                new NoMove()
            );
            expect(diff.list).toEqual(['on_move']);
        });

    });

});
