//controller
//es6 modules. by default, modules use strict
import View from "./view.js";
import Model from "./model.js";

const players = [
    {
        id: 1,
        name: "Player 1",
        iconClass: "fa-x",
        colorClass: "turquoise",
    },
    {
        id: 2,
        name: "Player 2",
        iconClass: "fa-o",
        colorClass: "yellow",
    },
];

function init() {
    const view = new View();
    const store = new Model('live-t3-storage-key', players);

    store.addEventListener('stateChange', () => {
        view.render(store.game, store.stats);
    });

    window.addEventListener('storage', () => {
        view.render(store.game, store.stats);
    });

    view.render(store.game, store.stats);

    view.bindGameResetEvent(event => {
        store.reset();
    });

    view.bindNewRoundEvent(event => {
        store.newRound();
    });

    view.bindPlayerMoveEvent((square) => {
        //check if an icon has already been placed on that square
        const existingMove = store.game.moves.find(move => move.squareId === +square.id);

        if (existingMove) {
            return;
        }

        //Advance to next state by pushing move to the moves array
        store.playerMove(+square.id);
    });
}

window.addEventListener('load', () => init());



