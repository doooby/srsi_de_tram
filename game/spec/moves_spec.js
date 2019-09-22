import {cards, Card} from '../src/card';
import {LayMove, DrawMove, NoMove, QueerMove} from '../src/move';
import State from '../src/state';

describe('game rules', () => {

    beforeEach(function() {
        jasmine.addMatchers({

            toBeValidMove: () => {return {compare: (move) => {
                if (move.valid !== true) return {
                    pass: false,
                    message: 'Move is not valid, error=' + move.error
                };

                return {pass: true};
            }};},

            toBeInvalidMove: () => {return {compare: (move, reason) => {
                if (move.valid !== false) return {
                    pass: false,
                    message: 'Move should not be valid!'
                };

                if (move.error !== reason) return {
                    pass: false,
                    message: 'Expected move to fail because of "' + reason + '" but the error was "' + move.error + '".'
                };

                return {pass: true};
            }};}

        });
    });

    function layMove (state, card) {
        const move = new LayMove(card);
        move.evaluate(state);
        return move;
    }

    function drawMove (state) {
        const move = new DrawMove();
        move.evaluate(state);
        return move;
    }

    function noMove (state) {
        const move = new NoMove();
        move.evaluate(state);
        return move;
    }

    function queerMove (state, suit) {
        const move = new QueerMove(suit);
        move.evaluate(state);
        return move;
    }

    describe('basics', () => {

        it('no matching suit or rank', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.NINE)],
                players: [
                    [new Card(cards.ACORNS | cards.TEN)]
                ]
            });
            const move = layMove(state, 0);
            expect(move).toBeInvalidMove('no_match');
        });

        it('matching suit', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.NINE)],
                players: [
                    [new Card(cards.HEARTS | cards.TEN)]
                ]
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

        it('matching rank', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.NINE)],
                players: [
                    [new Card(cards.ACORNS | cards.NINE)]
                ]
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

        it('simply draw', () => {
            const state = State.at({
                deck: [new Card(0), new Card(0)],
                pile: [new Card(cards.HEARTS | cards.NINE)]
            });
            const move = drawMove(state);
            expect(move).toBeValidMove();
        });

        it('simply draw - not enough', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.NINE)]
            });
            const move = drawMove(state);
            expect(move).toBeInvalidMove('not_enough_cards');
        });

        it('can lay joker on anything', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.NINE)],
                players: [
                    [new Card(cards.JOKER)]
                ]
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

        it('can lay anything on joker - discontinued', () => {
            const state = State.at({
                pile: [new Card(cards.JOKER)],
                players: [
                    [new Card(cards.LEAVES | cards.NINE)]
                ]
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

    });

    describe('attack cards', () => {

        it ('cannot lay while attacked', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.SEVEN)],
                players: [
                    [new Card(cards.HEARTS | cards.NINE)]
                ],
                continuance: true,
                attack: 2
            });
            const move = layMove(state, 0);
            expect(move).toBeInvalidMove('attack');
        });

        it('draw while attacked', () => {
            const state = State.at({
                deck: [new Card(0)],
                pile: [new Card(0), new Card(cards.HEARTS | cards.SEVEN)],
                continuance: true,
                attack: 2
            });
            const move = drawMove(state);
            expect(move).toBeValidMove();
        });

        it('draw while attacked - not enough', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.SEVEN)],
                continuance: true,
                attack: 2
            });
            const move = drawMove(state);
            expect(move).toBeInvalidMove('not_enough_cards');
        });

        it('attack with seven', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.NINE)],
                players: [
                    [new Card(cards.HEARTS | cards.SEVEN)]
                ]
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

        it('king only returns', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.SEVEN)],
                players: [
                    [new Card(cards.HEARTS | cards.KING)]
                ],
                continuance: true,
                attack: 2
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

        it('attack with king of leaves', () => {
            const state = State.at({
                pile: [new Card(cards.LEAVES | cards.SEVEN)],
                players: [
                    [new Card(cards.LEAVES | cards.KING)]
                ],
                continuance: true,
                attack: 2
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

        it('joker', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.NINE)],
                players: [
                    [new Card(cards.JOKER | cards.JOKER)]
                ]
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

        it('seven on joker', () => {
            const state = State.at({
                pile: [new Card(cards.JOKER)],
                players: [
                    [new Card(cards.HEARTS | cards.SEVEN)]
                ],
                continuance: true,
                attack: 5
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

    });

    describe('defensive cards', () => {

        it('ten on attack', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.SEVEN)],
                players: [
                    [new Card(cards.HEARTS | cards.TEN)]
                ],
                continuance: true,
                attack: 2
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

        it('no attack on ten', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.TEN)],
                players: [
                    [new Card(cards.HEARTS | cards.SEVEN)]
                ],
                continuance: true
            });
            const move = layMove(state, 0);
            expect(move).toBeInvalidMove('attack_on_ten');
        });

        it('no attack on ten - discontinued', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.TEN)],
                players: [
                    [new Card(cards.HEARTS | cards.SEVEN)]
                ]
            });
            const move = layMove(state, 0);
            expect(move).toBeInvalidMove('attack_on_ten');
        });

    });

    describe('change cards', () => {

        it('jack changes on whatever', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.NINE)],
                players: [
                    [new Card(cards.ACORNS | cards.JACK)]
                ]
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

        it('lay queen', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.NINE)],
                players: [
                    [new Card(cards.HEARTS | cards.QUEEN)]
                ]
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

        it('queen invalid', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.QUEEN)]
            });
            const move = queerMove(state);
            expect(move).toBeInvalidMove('no_queen');
        });

        it('queen', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.QUEEN)],
                queer: true
            });
            const move = queerMove(state);
            expect(move).toBeValidMove();
        });

        it('queen with change', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.QUEEN)],
                queer: true
            });
            const move = queerMove(state, cards.BELLS);
            expect(move).toBeValidMove();
        });

        it('queen & queer only', () => {
            const state = State.at({
                deck: [new Card(0)],
                pile: [new Card(cards.HEARTS | cards.QUEEN)],
                queer: true,
                continuance: true
            });
            expect(drawMove(state)).toBeInvalidMove('queer');
            expect(layMove(state, 0)).toBeInvalidMove('queer');
            expect(noMove(state)).toBeInvalidMove('queer');
        });

        it('draw after queen changed', () => {
            const state = State.at({
                deck: [new Card(0)],
                pile: [new Card(cards.HEARTS | cards.QUEEN)],
                queer: cards.HEARTS,
                continuance: true
            });
            expect(drawMove(state)).toBeValidMove();
        });

        it('draw after queen changed - discontinued', () => {
            const state = State.at({
                deck: [new Card(0)],
                pile: [new Card(cards.HEARTS | cards.QUEEN)],
                queer: cards.HEARTS
            });
            expect(drawMove(state)).toBeValidMove();
        });

        it('lay after queen changed', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.QUEEN)],
                players: [
                    [new Card(cards.ACORNS | cards.TEN)]
                ],
                queer: cards.ACORNS,
                continuance: true
            });
            expect(layMove(state, 0)).toBeValidMove();
        });

        it('lay after queen changed - discontinued', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.QUEEN)],
                players: [
                    [new Card(cards.ACORNS | cards.TEN)]
                ],
                queer: cards.ACORNS
            });
            expect(layMove(state, 0)).toBeValidMove();
        });

    });

    describe('special rules', () => {

        it('nine on ace', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.ACE)],
                players: [
                    [new Card(cards.HEARTS | cards.NINE)]
                ],
                continuance: true
            });
            const move = layMove(state, 0);
            expect(move).toBeInvalidMove('ace');
        });

        it('nine on ace - discontinued', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.ACE)],
                players: [
                    [new Card(cards.HEARTS | cards.NINE)]
                ]
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

        it('ace on ace', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.ACE)],
                players: [
                    [new Card(cards.ACORNS | cards.ACE), new Card(0)]
                ],
                continuance: true
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

        it('cannot draw on ace', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.ACE)],
                continuance: true
            });
            const move = drawMove(state);
            expect(move).toBeInvalidMove('ace');
        });

        it('can draw on ace - discontinued', () => {
            const state = State.at({
                deck: [new Card(0)],
                pile: [new Card(cards.HEARTS | cards.ACE)]
            });
            const move = drawMove(state);
            expect(move).toBeValidMove();
        });

        it('cannot do just nothing - only on ace', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.ACE)]
            });
            const move = noMove(state);
            expect(move).toBeInvalidMove('nothing');
        });

        it('cannot end with ace', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.NINE)],
                players: [
                    [new Card(cards.HEARTS | cards.ACE)]
                ]
            });
            const move = layMove(state, 0);
            expect(move).toBeInvalidMove('ace_end');
        });

        it('lay multiple eights', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.EIGHT)],
                players: [
                    [new Card(cards.ACORNS | cards.EIGHT)]
                ],
                continuance: true,
                eights: 1
            });
            const move = layMove(state, 0);
            expect(move).toBeValidMove();
        });

        it('multiple eights - not enough cards', () => {
            const state = State.at({
                pile: [new Card(0), new Card(cards.HEARTS | cards.NINE)],
                players: [
                    [new Card(cards.HEARTS | cards.EIGHT)]
                ],
                continuance: true,
                eights: 3
            });
            const move = drawMove(state);
            expect(move).toBeInvalidMove('not_enough_cards');
        });

        it('only eights can be multiple', () => {
            const state = State.at({
                pile: [new Card(cards.HEARTS | cards.EIGHT)],
                players: [
                    [new Card(cards.HEARTS | cards.TEN)]
                ],
                continuance: true,
                eights: 1
            });
            const move = layMove(state, 0);
            expect(move).toBeInvalidMove('eights');
        });

    });

});
