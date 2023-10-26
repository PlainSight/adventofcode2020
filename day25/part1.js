var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var DIVISOR = 20201227;

var publicKeyOne = parseInt(input[0]);
var publicKeyTwo = parseInt(input[1]);

var loopOne = 0;
var loopTwo = 0;

var accOne = 1;
var accTwo = 1;

var oneGood = false;
var twoGood = false;

for (var n = 1; ; n++) {
    if (oneGood && twoGood) break;

    accOne = (accOne * 7) % DIVISOR;
    accTwo = (accTwo * 7) % DIVISOR;

    if (accOne == publicKeyOne) {
        oneGood = true;
        loopOne = n;
    }
    if (accTwo == publicKeyTwo) {
        twoGood = true;
        loopTwo = n;
    }
}

var encryp = 1;

var smallestLoopNumber = Math.min(loopOne, loopTwo);

var pubKeyAssociated = loopOne == smallestLoopNumber ? publicKeyTwo : publicKeyOne;

for (var n = 0; n < smallestLoopNumber; n++) {
    encryp = (encryp * pubKeyAssociated) % DIVISOR;
}

console.log(encryp);