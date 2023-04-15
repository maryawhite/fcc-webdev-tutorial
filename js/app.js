//controller
//es6 modules. by default modules use strict
import View from "./view.js";
import Model from "./model.js";

// const App = {
//     //All of our selected HTML elements in their own namespace
//     $: {
//
//     },
//
//     state: {
//         moves: [],
//     },
//
//     getGameStatus(moves) {
//         const p1Moves = moves.filter(move => move.playerId === 1).map(move => +move.squareId);
//         const p2Moves = moves.filter(move => move.playerId === 2).map(move => +move.squareId);
//
//         const winningPatterns = [
//             [1, 2, 3],
//             [1, 5, 9],
//             [1, 4, 7],
//             [2, 5, 8],
//             [3, 5, 7],
//             [3, 6, 9],
//             [4, 5, 6],
//             [7, 8, 9],
//         ];
//
//         let winner = null;
//
//         winningPatterns.forEach(pattern => {
//             const p1Wins = pattern.every(v => p1Moves.includes(v));
//             const p2Wins = pattern.every(v => p2Moves.includes(v));
//
//             if(p1Wins) winner = 1;
//             if(p2Wins) winner = 2;
//         })
//
//         return {
//             status: moves.length === 9 || winner != null ? 'complete' : 'in-progress',
//             winner
//         }
//     },
//
//     init() {
//         App.registerEventListeners();
//     },
//
//     registerEventListeners(){
//         App.$.menu.addEventListener('click', (event) => {
//             App.$.menuItems.classList.toggle('hidden')
//         });
//
//         App.$.resetBtn.addEventListener('click', (event) => {
//             console.log("Reset the game.");
//         });
//
//         App.$.newRoundBtn.addEventListener('click', (event) => {
//             console.log("Add a new round.");
//         });
//
//         App.$.modalBtn.addEventListener('click', (event) => {
//             App.state.moves = []
//             App.$.squares.forEach(square => square.replaceChildren());
//             App.$.modal.classList.add('hidden')
//         });
//
//         App.$.squares.forEach((square) => {
//             square.addEventListener('click', (event) => {
//
//                 //check if there's already a play, if so return early.
//                 const hasMove = (squareId) => {
//                     const existingMove = App.state.moves.find(move => move.squareId === squareId)
//                     return existingMove != null
//                 };
//
//                 if(hasMove(+square.id)){
//                     return;
//                 }
//
//                 //determine which player icon to add to the square
//                 const lastMove = App.state.moves.at(-1);
//                 const getOppositePlayer = (playerId) => playerId === 1 ? 2 : 1;
//                 const currentPlayer = App.state.moves.length === 0 ? 1 : getOppositePlayer(lastMove.playerId);
//                 const nextPlayer = getOppositePlayer(currentPlayer);
//
//                 const squareIcon = document.createElement('i');
//                 const turnIcon = document.createElement('i');
//                 const turnLabel = document.createElement('p');
//                 turnLabel.innerText = `Player ${nextPlayer}, you are up!`;
//
//                 if(currentPlayer === 1) {
//                     squareIcon.classList.add('fa-solid', 'fa-x', 'yellow');
//                     turnIcon.classList.add('fa-solid', 'fa-o', 'turquoise');
//                     turnLabel.classList = 'turquoise';
//
//                 } else {
//                     squareIcon.classList.add('fa-solid', 'fa-o', 'turquoise');
//                     turnIcon.classList.add('fa-solid', 'fa-x', 'yellow');
//                     turnLabel.classList = 'yellow';
//                 }
//
//                 App.$.turn.replaceChildren(turnIcon, turnLabel);
//
//                 App.state.moves.push({
//                     squareId: +square.id,
//                     playerId: currentPlayer
//                 });
//
//                 //next players turn
//                 App.state.currentPlayer = currentPlayer === 1 ? 2 : 1;
//
//                 square.replaceChildren(squareIcon);
//
//                 const game = App.getGameStatus(App.state.moves);
//
//                 console.log(status);
//                 if(game.status === 'complete') {
//
//                     App.$.modal.classList.remove('hidden');
//
//                     let message = '';
//                     if(game.winner) {
//                         message = `Player ${game.winner} wins!`
//                     } else {
//                         message = 'Tie game!'
//                     }
//
//                     App.$.modalText.textContent = message;
//                 }
//             });
//         });
//     },
// };
//
// window.addEventListener('load', () => App.init());

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
    const store = new Model(players);

    console.log(store.game);

    view.bindGameResetEvent(event => {
        view.closeAll();
        store.reset();
        view.clearMoves();
        view.setTurnIndicator(store.game.currentPlayer);
    });

    view.bindNewRoundEvent(event => {
        console.log("New Round");
        console.log(event);
    });

    view.bindPlayerMoveEvent((square) => {

        //check if an icon has already been placed on that square
        const existingMove = store.game.moves.find(move => move.squareId === +square.id);

        if(existingMove) {
            return;
        }

        //place an icon of the current player in the square
        view.handlePlayerMove(square, store.game.currentPlayer);

        //Advance to next state by pushing move to the moves array
        store.playerMove(+square.id);

        //check if anyone has won
        if(store.game.status.isComplete) {
            view.openModal(store.game.status.winner ? `${store.game.status.winner.name} wins!` : "Tie!");
            return;
        }

        //set the next player's turn indicator
        view.setTurnIndicator(store.game.currentPlayer);


    });

}

window.addEventListener('load', () => init());



