var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        {locations: ['10', '20', '30'], hits: ['', '', '']},
        {locations: ['32', '33', '34'], hits: ['', '', '']},
        {locations: ['63', '64', '65'], hits: ['', '', '']}
    ],

    fire: function (guess) {
        for (var i = 0; i < this.shipLength; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT !');
                if (this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship !');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You missed !');
        return false;
    },
    isSunk: function (ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    }
};

var view = {
    displayMessage: function (msg) {
        var messageArea = document.getElementById('messageArea');
        messageArea.textContent = msg;
    },
    displayHit: function (location) {
        var cell = document.getElementById(location);
        cell.classList.add('hit');
    },
    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.classList.add('miss');
    }
};

var controller = {
    guess: 0,
    processGuess: function (guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guess++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage('You sank all my battleships, in ' +
                    this.guess + ' guesses');
            }
        }
    }
};

// function-helper: validator of user input and converter(example: a0 -> 00; d3 -> 33 etc.)
function parseGuess(guess) {
    var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    if (guess === null || guess.length !== 2) {
        view.displayMessage('Please enter 1 character in English and 1 integer');
    } else {
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) {
            view.displayMessage('That isn\'t on the board !');
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            view.displayMessage('That\'s off the board !');
        } else {
            return row + column;
        }
    }
    return null;
}

var $btn = document.getElementById('fireButton');
$btn.addEventListener('click', function (event) {
    event.preventDefault();
    var $input = document.getElementById('guessInput');
    controller.processGuess($input.value.toLowerCase());
    $input.value = '';
});