var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var cups = input[0].split('').map(m => parseInt(m));

var MOVES = 100;

function rotateCups() {
    var first = cups.shift();
    cups.push(first);
}

for(var n = 0; n < MOVES; n++) {
    var currentCup = cups[0];

    var pickedUp = cups.splice(1,  3);

    var destinationCup = currentCup - 1;

    if (destinationCup == 0) {
        destinationCup = 9;
    }

    while (pickedUp.includes(destinationCup)) {
        destinationCup--;
        if (destinationCup == 0) {
            destinationCup = 9;
        }
    }

    //console.log(cups, 'dest', destinationCup, 'idx', cups.indexOf(destinationCup));

    cups.splice(cups.indexOf(destinationCup) + 1, 0, ...pickedUp);

    // rotate array so that the current cup is aways position zero of the array;
    rotateCups();
}

var indexOfOne = cups.indexOf(1);

for (var n = 0; n < indexOfOne; n++) {
    rotateCups();
}

console.log(cups.slice(1).join(''));