var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var cards1 = input[0].split('\r\n');
cards1.shift();
var cards2 = input[1].split('\r\n');
cards2.shift();

var deck1 = cards1.map(m => parseInt(m)).reverse();
var deck2 = cards2.map(m => parseInt(m)).reverse();

while (deck1.length > 0 && deck2.length > 0) {
    var p1card = deck1.pop();
    var p2card = deck2.pop();

    if (p1card > p2card) {
        deck1.unshift(p1card);
        deck1.unshift(p2card);
    } else {
        deck2.unshift(p2card);
        deck2.unshift(p1card);
    }
}

var finalScore = 0;

if (deck1.length > 0) {
    var scoreMul = deck1.length;
    while (deck1.length) {
        finalScore += (deck1.pop() * scoreMul);
        scoreMul--;
    }
} else {
    var scoreMul = deck2.length;
    while (deck2.length) {
        finalScore += (deck2.pop() * scoreMul);
        scoreMul--;
    }
}

console.log(finalScore)
