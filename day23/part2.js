var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var startCups = input[0].split('').map(m => parseInt(m));

var arrayOfCups = [];

var MOVES = 10000000;

function makeNode(n) {
    var node = {
        val: n,
        next: null,
        prev: null
    };

    arrayOfCups[n] = node;

    return node;
}

var firstNode = null;
var lastNode = null;

for (var n = 0; n < startCups.length; n++) {
    var newNode = makeNode(startCups[n]);

    if (n == 0) {
        firstNode = newNode;
    }

    if (lastNode) {
        newNode.prev = lastNode;
        lastNode.next = newNode;
    }

    lastNode = newNode;
}

for (var n = 10; n <= 1000000; n++) {
    var newNode = makeNode(n);

    newNode.prev = lastNode;
    lastNode.next = newNode;

    lastNode = newNode;
}

lastNode.next = firstNode;
firstNode.prev = lastNode;

// nodes are all created

var currentCup = firstNode;

for(var n = 0; n < MOVES; n++) {

    if (n != 0) {
        currentCup = currentCup.next;
    }

    // pick up the next 3 cups;
    // fix pointers for those on either side

    var pu1 = currentCup.next;
    var pu2 = pu1.next;
    var pu3 = pu2.next;

    currentCup.next = pu3.next;
    pu3.prev = currentCup;

    var destinationCupValue = currentCup.val - 1;

    if (destinationCupValue == 0) {
        destinationCupValue = 1000000;
    }

    while ([pu1.val, pu2.val, pu3.val].includes(destinationCupValue)) {
        destinationCupValue--;
        if (destinationCupValue == 0) {
            destinationCupValue = 1000000;
        }
    }

    var destinationCup = arrayOfCups[destinationCupValue];
    var nextAfterDestinationCup = destinationCup.next;

    // fix start of insert
    pu1.prev = destinationCup;
    destinationCup.next = pu1;

    // fix end of insert
    pu3.next = nextAfterDestinationCup;
    nextAfterDestinationCup.prev = pu3;
}

// get the final result
var cupOne = arrayOfCups[1];
var nextCup = cupOne.next;
var nextNextCup = nextCup.next;

console.log(nextCup.val * nextNextCup.val);