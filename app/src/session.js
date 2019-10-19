import Game from 'GAME_PATH/src/game';
import Player from 'GAME_PATH/src/player';
import { cards } from 'GAME_PATH/src/cards';

export default class Session {

    constructor () {
        this.game = null;
    }

    init (local, players_names) {
        this.game = new Game(
            players_names.map(name => new Player(name)),
            local
        );
        this.game.history = [];
    }

    attachLocalPlayer ({ state_changed, bad_move }) {
        const local = this.game.local_player;

        local.subscribe('state_changed', () => {
            state_changed(this.game.state);
        });

        local.subscribe('bad_move', (player, move) => {
            if (local !== player) return;
            bad_move(move);
        });
    }

    attachRemotePlayer (index, actor) {
        this.game.players[index].attachActor(actor);
    }

    begin (on_event) {
        this.game.begin(cards.createNewShuffledDeck());
        on_event({ name: 'started', game_state: this.game.state });
    }

}
