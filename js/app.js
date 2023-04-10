"use strict"

const App = {
    //All of our selected HTML elements in their own namespace
    $: {
        menu: document.querySelector('[data-id="menu"]'),
        menuItems: document.querySelector('[data-id="menu-items"]'),
        resetBtn: document.querySelector('[data-id="reset-btn"]'),
        newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
        squares: document.querySelectorAll('[data-id="square"]'),
    },

    state: {
        currentPlayer: 1
    },

    init() {
        App.registerEventListeners();
    },

    registerEventListeners(){
        App.$.menu.addEventListener('click', (event) => {
            App.$.menuItems.classList.toggle('hidden')
        });

        App.$.resetBtn.addEventListener('click', (event) => {
            console.log("Reset the game.");
        });

        App.$.newRoundBtn.addEventListener('click', (event) => {
            console.log("Add a new round.");
        });

        App.$.squares.forEach((square) => {
            square.addEventListener('click', (event) => {
                console.log(`Square with id ${event.target.id} was clicked`);

                const icon = document.createElement('i');
                icon.classList.add('fa-solid', 'fa-x', 'yellow');

                event.target.replaceChildren(icon);
                //<i class="fa-solid fa-x yellow"></i>
            });
        });
    },
};

window.addEventListener('load', () => App.init());




