
const HIDE_DELAY = 1000;
const NEXT_CLICK_DELAY = 300;
let cardsOfArray = ['fa-diamond', 'fa-plane', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-plane', 'fa-cube'];
const deck = document.querySelector("ul.deck");
const allCardsOpened = 16;
const restart = document.querySelector(".restart");
restart.addEventListener("click", function (event) {
    setupGame();
});
const moveCounter = {
    numberOfMoves: 0,
    reset: function () {
        this.numberOfMoves = 0;
        this.updateUI();
    },
    increment: function () {
        this.numberOfMoves += 1;
        this.updateUI();
    },
    updateUI: function () {
        const movesCounterElem = document.querySelector(".moves");
        movesCounterElem.innerHTML = this.numberOfMoves;
    }
};
const clickBlocker = {
    lastClickTime: undefined,
    canClick: function () {
        const currentTime = (new Date()).getTime();
        let result = true;
        if (this.lastClickTime) {
            result = (currentTime - this.lastClickTime) > NEXT_CLICK_DELAY;
        }
        this.lastClickTime = currentTime;
        return result;
    }
}

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

function setupGame() {
    moveCounter.reset();
    const shaffledCardsClasses = shuffle(cardsOfArray);
    deck.innerHTML = '';

    for (const cardClass of shaffledCardsClasses) {
        const cardElem = document.createElement('li');
        cardElem.classList.add('card');
        const icon = document.createElement('i');
        icon.classList.add('fa', cardClass);
        cardElem.appendChild(icon);
        deck.appendChild(cardElem);
    }
    setupCards(deck);
}
setupGame();

function setupCards(deck) {
    let openedCardsArray = [];
    const openCard = function (card) {
        card.classList.add("open", "show");
    };
    const closeCard = function (card) {
        card.classList.remove("open", "show");
    };
    const isCardOpened = function (card) {
        card.classList.contains("open");
    };
    const cardElems = deck.children;
    for (const cardElem of cardElems) {
        cardElem.addEventListener('click', function (event) {
            let clickedCard = event.target;
            if (clickedCard.nodeName !== "LI") {
                clickedCard = clickedCard.parentNode;
            }
            const shouldIgnore = isCardOpened(clickedCard) || openedCardsArray.length > 1 || !clickBlocker.canClick();
            if (shouldIgnore) {
                return;
            }

            if (openedCardsArray.length < 2) {
                const oneCardOpened = openedCardsArray.length === 1;
                const clickedTheSameCard = openedCardsArray[0] === clickedCard;
                if (oneCardOpened && clickedTheSameCard) {
                    return;
                }

                moveCounter.increment();
                openedCardsArray.push(clickedCard);
                openCard(clickedCard);
            }

            if (openedCardsArray.length === 2) {
                const firstCard =  openedCardsArray[0];
                const secondCard = openedCardsArray[1];
                const firstOpenedCardIcon = firstCard.children[0];
                const secondOpenedCardIcon = secondCard.children[0];
                const firstOpenedCardIconClasses = firstOpenedCardIcon.classList;
                const secondOpenedCardIconClasses = secondOpenedCardIcon.classList;
                let iconsHaveTheSameClasses = true;
                const iconsHaveTheSameNumberOfClasses = firstOpenedCardIconClasses.length === secondOpenedCardIconClasses.length;

                for (const iconClass of firstOpenedCardIconClasses) {
                    if (!secondOpenedCardIconClasses.contains(iconClass)) {
                        iconsHaveTheSameClasses = false;
                    }
                }

                if (!iconsHaveTheSameClasses || !iconsHaveTheSameNumberOfClasses) {
                    for (const openedCard of openedCardsArray) {
                        setTimeout(() => {
                            closeCard(openedCard);
                        }, HIDE_DELAY);
                    }
                } else {
                    firstCard.classList.remove('open');
                    firstCard.classList.add('match');
                    secondCard.classList.remove('open');
                    secondCard.classList.add('match');
                }

                openedCardsArray = [];

            }

            if (document.querySelectorAll("li.match").length === allCardsOpened) {
                setTimeout(() => {
                    alert("CONGRATULATIONS!");
                }, 400);
            }
        });
    }
}