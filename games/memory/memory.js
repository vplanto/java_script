const gameBoard = document.getElementById('game-board');

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'cyan'];
let cards = [...colors, ...colors].map(color => ({ color, flipped: false }));

cards.sort(() => Math.random() - 0.5);

let firstCard = null;
let secondCard = null;
let pairsFound = 0;

function drawCard(i, card) {
    const div = document.createElement('div');
    div.classList.add('card');
    div.style.left = `${(i % 4) * 100}px`;
    div.style.top = `${Math.floor(i / 4) * 100}px`;
    div.style.background = card.flipped ? card.color : 'grey';
    div.addEventListener('click', () => flipCard(i));
    gameBoard.appendChild(div);
}

function drawBoard() {
    gameBoard.innerHTML = '';
    cards.forEach((card, i) => drawCard(i, card));
}

function flipCard(i) {
    const card = cards[i];

    if (card.flipped || firstCard && secondCard) return;

    card.flipped = true;
    drawBoard();

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;

        if (firstCard.color === secondCard.color) {
            pairsFound++;
            if (pairsFound === colors.length) alert('You won!');
            firstCard = secondCard = null;
        } else {
            setTimeout(() => {
                firstCard.flipped = secondCard.flipped = false;
                drawBoard();
                firstCard = secondCard = null;
            }, 1000);
        }
    }
}

drawBoard();
