//store

const initialValue = {
    moves: [],
};

export default class Store {

    #state = initialValue;

    constructor(players) {
        this.players = players;
    }

    /**
     * getter method to take in the raw state and calculate useful information.
     */
    get game() {
        const state = this.#getState();

        //use modulus operator to determine who the current player is. 0 index is player 1, 1 index is player 2
        const currentPlayer = this.players[state.moves.length % 2];

        return {currentPlayer,
        };
    }

    #getState() {
        return this.#state;
    }

    #saveState(stateOrFn) {
        const prevState = this.#getState;

        let newState;

        switch(typeof stateOrFn) {
            case 'function' :
                newState = stateOrFn(prevState);
                break;
            case 'object' :
                newState = stateOrFn;
                break;
            default:
                throw new Error("Invalid argument passed to saveState");
        }

        this.#state = newState;

    }

}