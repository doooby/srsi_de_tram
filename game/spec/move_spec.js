import {cards} from '../src/cards';
import {Moves, LayMove, DrawMove, QueerMove, NoMove} from '../src/moves';

describe('moves serialization', () => {

    it('LayMove', () => {
        const move_data = (new LayMove(2)).serialize();
        expect(move_data).toEqual(Moves.parse(move_data).serialize());
    });

    it('DrawMove', () => {
        const move_data = (new DrawMove()).serialize();
        expect(move_data).toEqual(Moves.parse(move_data).serialize());
    });

    it('QueerMove', () => {
        const move_data = (new QueerMove(cards.ACORNS)).serialize();
        expect(move_data).toEqual(Moves.parse(move_data).serialize());
    });

    it('NoMove', () => {
        const move_data = (new NoMove()).serialize();
        expect(move_data).toEqual(Moves.parse(move_data).serialize());
    });

});
