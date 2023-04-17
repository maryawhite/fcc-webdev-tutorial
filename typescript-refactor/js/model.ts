//store
import type {GameState, Move, Player} from "./types";

const initialValue: GameState = {
    currentGameMoves: [],
    history: {
        currentRoundGames: [],
        allGames: [],
    },
};

export default class Model extends EventTarget {

    constructor(private readonly storageKey: string, private readonly players: Player[]) {
        super(); //required because we're extending EventTarget
    }

    get stats() {

        const state = this.#getState();

        return {
            playerWithStats: this.players.map(player => {
                const wins = state.history.currentRoundGames
                    .filter(game => game.status.winner?.id === player.id).length;
                return {
                    ...player,
                    wins,
                };
            }),
            ties: state.history.currentRoundGames.filter((game) => game.status.winner === null).length,
        };
    }

    get game() {
        const state = this.#getState();

        //use modulus operator to determine who the current player is. 0 index is player 1, 1 index is player 2
        const currentPlayer = this.players[state.currentGameMoves.length % 2];

        const winningPatterns = [
            [1, 2, 3],
            [1, 5, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 5, 7],
            [3, 6, 9],
            [4, 5, 6],
            [7, 8, 9],
        ];

        let winner: Player | null = null;

        for (const player of this.players) {
            const selectedSquareIds = state.currentGameMoves.filter(
                (move) => move.player.id === player.id).map(
                (move) => move.squareId);

            for (const pattern of winningPatterns) {
                if (pattern.every((v) => selectedSquareIds.includes(v))) {
                    winner = player;
                }
            }
        }

        return {
            moves: state.currentGameMoves,
            currentPlayer,
            status: {
                isComplete: winner != null || state.currentGameMoves.length === 9,
                winner,
            },
        };
    }

    playerMove(squareId: Move['squareId']) {
        //Never mutate state directly, Create a copy and edit the copy, and save copy as new version of state
        const stateClone = structuredClone(this.#getState());

        stateClone.currentGameMoves.push({
            squareId,
            player: this.game.currentPlayer
        });

        this.#saveState(stateClone);
    }

    /**
     * Resets the game.
     */
    reset() {
        const stateClone = structuredClone(this.#getState());

        const {status, moves} = this.game;

        if (status.isComplete) {
            stateClone.history.currentRoundGames.push({
                moves,
                status,
            });
        }

        stateClone.currentGameMoves = [];

        this.#saveState(stateClone);
    }

    /**
     * Resets the scoreboard (wins, losses, and ties).
     */
    newRound() {
        this.reset();

        const stateClone = structuredClone(this.#getState()) as GameState;
        stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
        stateClone.history.currentRoundGames = [];

        this.#saveState(stateClone);
    }

    #saveState(stateOrFn: ((prev: GameState) => GameState) | GameState) {
        const prevState = this.#getState();

        let newState;

        switch (typeof stateOrFn) {
            case 'function':
                newState = stateOrFn(prevState);
                break;
            case 'object':
                newState = stateOrFn;
                break;
            default:
                throw new Error("Invalid argument passed to saveState");
        }

        window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
        this.dispatchEvent(new Event('stateChange'));
    }

    #getState(): GameState {
        const item = window.localStorage.getItem(this.storageKey);
        return item ? JSON.parse(item) : initialValue;
    }
}