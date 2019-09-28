import {cards, Card} from '../src/cards';
import Player from '../src/player';
import State from '../src/state';

describe('possible moves', () => {

    var at_situation = function (pile_card, state_at) {
        state_at['pile'] = [pile_card];
        if (!state_at['players']) state_at['players'] = [[]];
        const player = new Player('');
        player.index = 0;
        player.game = {state: State.at(state_at)};
        return player.possibleActions();
    };

    it('no on move', () => {
        const actions = at_situation(new Card(cards.JOKER), {
            players: [[], []],
            on_move: 1
        });
        expect(actions).toEqual([]);
    });

    it('on standard situation', () => {
        const actions = at_situation(new Card(cards.HEARTS | cards.NINE), {
            continuance: true
        });
        expect(actions).toEqual(['draw', 'lay']);
    });

    it('on non-continuance', () => {
        const actions = at_situation(new Card(cards.JOKER), {});
        expect(actions).toEqual(['draw', 'lay']);
    });

    it('on attack', () => {
        const actions = at_situation(new Card(cards.HEARTS | cards.SEVEN), {
            continuance: true,
            attack: 2
        });
        expect(actions).toEqual(['devour', 'lay']);
    });

    it('on ace', () => {
        const actions = at_situation(new Card(cards.HEARTS | cards.ACE), {
            continuance: true
        });
        expect(actions).toEqual(['stay', 'lay']);
    });

    it('cannot lay ace as last', () => {
        const actions = at_situation(new Card(cards.BELLS | cards.ACE), {
            players: [[new Card(cards.ACORNS | cards.ACE)]],
            continuance: true
        });
        expect(actions).toEqual(['stay']);
    });

    it('cannot lay ace as last - discontinued', () => {
        const actions = at_situation(new Card(cards.BELLS | cards.NINE), {
            players: [[new Card(cards.BELLS | cards.ACE)]]});
        expect(actions).toEqual(['draw']);
    });

    it('after queen', () => {
        const actions = at_situation(new Card(cards.HEARTS | cards.QUEEN), {
            continuance: true,
            queer: true
        });
        expect(actions).toEqual(['queer']);
    });

    it('after eight', () => {
        const actions = at_situation(new Card(cards.HEARTS | cards.EIGHT), {
            continuance: true,
            eights: 1
        });
        expect(actions).toEqual(['draw', 'lay']);
    });

    it('after eight, having no more', () => {
        const actions = at_situation(new Card(cards.HEARTS | cards.EIGHT), {
            players: [[new Card(cards.HEARTS | cards.NINE)]],
            continuance: true,
            eights: 1
        });
        expect(actions).toEqual(['draw', 'lay']);
    });

    it('attacked, having only ace', () => {
        const actions = at_situation(new Card(cards.JOKER), {
            players: [[new Card(cards.BELLS | cards.ACE)]],
            continuance: true,
            attack: 5
        });
        expect(actions).toEqual(['devour']);
    });

});
