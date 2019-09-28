const { cards } = require('../src/cards');
const { parseMove, createMove } = require('../src/moves');

describe('moves serialization', () => {

    it('LayMove', () => {
        const move = createMove('lay', 2).serialize();
        expect(move).toEqual(parseMove(move).serialize());
    });

    it('DrawMove', () => {
        const move = createMove('draw').serialize();
        expect(move).toEqual(parseMove(move).serialize());
    });

    it('QueerMove', () => {
        const move = createMove('queer', cards.ACORNS).serialize();
        expect(move).toEqual(parseMove(move).serialize());
    });

    it('NoMove', () => {
        const move = createMove('no').serialize();
        expect(move).toEqual(parseMove(move).serialize());
    });

});
