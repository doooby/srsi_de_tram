import {cards} from '../src/card';
import {Move, LayMove, DrawMove, QueerMove, NoMove} from '../src/move';

describe('moves serialization', () => {

    it('LayMove', () => {
        const move_data = (new LayMove(2)).serialize();
        expect(move_data).toEqual(Move.parse(move_data).serialize());
    });

    it('DrawMove', () => {
        const move_data = (new DrawMove()).serialize();
        expect(move_data).toEqual(Move.parse(move_data).serialize());
    });

    it('QueerMove', () => {
        const move_data = (new QueerMove(cards.ACORNS)).serialize();
        expect(move_data).toEqual(Move.parse(move_data).serialize());
    });

    it('NoMove', () => {
        const move_data = (new NoMove()).serialize();
        expect(move_data).toEqual(Move.parse(move_data).serialize());
    });

});
