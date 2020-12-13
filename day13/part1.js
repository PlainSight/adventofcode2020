var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var earliestLeave = parseInt(input[0]);

var busIds = input[1].split(',').filter(f => f != 'x').map(m => parseInt(m));

console.log(earliestLeave, busIds);

var smallestNextBus = Infinity;
var bestBusId = 0;

for(var bid = 0; bid < busIds.length; bid++) {
    var mod = earliestLeave % busIds[bid];
    // mod = time since bus left
    var nextBusIn = busIds[bid] - mod;
    if (nextBusIn < smallestNextBus) {
        smallestNextBus = nextBusIn;
        bestBusId = busIds[bid];
    }
}

console.log(smallestNextBus * bestBusId);