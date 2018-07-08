/*
 * Create a list that holds all of your cards
 */
let cardsOfArray = ['fa-diamond', 'fa-plane', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-plane', 'fa-cube'];
const HIDE_DELAY = 500;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const shaffledCardsClasses = shuffle(cardsOfArray);
const deck = document.querySelector("ul.deck");
deck.innerHTML = '';

for (const cardClass of shaffledCardsClasses) {
    const cardElem = document.createElement('li');
    cardElem.classList.add('card');
    const icon = document.createElement('i');
    icon.classList.add('fa', cardClass);
    cardElem.appendChild(icon);
    deck.appendChild(cardElem);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const openCard = function (card) {
    card.classList.add("open", "show");
};
const closeCard = function (card) {
    card.classList.remove("open", "show");
};
let openedCardsArray = [];

const cardElems = deck.children;
for (const cardElem of cardElems) {
    cardElem.addEventListener('click', function (event) {
        const clickedCard = event.target;

        if (openedCardsArray.length < 2) {
            openedCardsArray.push(clickedCard);
            openCard(clickedCard);
        }

        if (openedCardsArray.length === 2) {
            const firstOpenedCardIcon = openedCardsArray[0].children[0];
            const secondOpenedCardIcon = openedCardsArray[1].children[0];
            const firstOpenedCardIconClasses = firstOpenedCardIcon.classList;
            const secondOpenedCardIconClasses = secondOpenedCardIcon.classList;
            let iconsHaveTheSameClasses = true;
            const iconsHaveTheSameNumberOfClasses = firstOpenedCardIconClasses.length === secondOpenedCardIconClasses.length;

            for (const iconClass of firstOpenedCardIconClasses) {
                if(!secondOpenedCardIconClasses.contains(iconClass)){
                    iconsHaveTheSameClasses = false;
                }
            }

            if(!iconsHaveTheSameClasses || !iconsHaveTheSameNumberOfClasses){
                for (const openedCard of openedCardsArray) {
                    setTimeout(() => {
                        closeCard(openedCard);
                    }, HIDE_DELAY);
                }
            }
            openedCardsArray = [];
        }
    });
}
