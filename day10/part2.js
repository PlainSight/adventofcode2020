var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var sorted = input.map(n => parseInt(n)).sort((a, b) => a - b);
sorted.unshift(0);
sorted.push(Math.max(...sorted)+3);

var paths = [];
var parents = [];

for(var i = 0; i < sorted.length-1; i++) {
    var validJumps = [];
    for (var j = i+1; j < sorted.length; j++) {
        if (sorted[j]-sorted[i] <= 3) {
            validJumps.push(sorted[j]);
        }
    }

    paths[sorted[i]] = validJumps;
}

for (var i in paths) {
    for(var j = 0; j < paths[i].length; j++) {
        var p = paths[i];
        if (parents[p[j]]) {
            parents[p[j]].push(i);
        } else {
            parents[p[j]] = [i];
        }
    }
}


function check(i) {
    if (!parents[i] || parents[i].length == 1) {
        return 1;
    }
    var value = 0;
    for (var j = 0; j < parents[i].length; j++) {
        value += check(parents[i][j]);
    }
    return value;
}

var result = 1;

var lastFork = 0;

for(var i in parents) {
    if (parents[i]) {

        if (parents[i].length == 1 && lastFork > 0) {
            // work backwards from here
            result *= check(lastFork);
            lastFork = -1;
        }

        if (parents[i].length > 1) {
            lastFork = i;
        }
    }
}

console.log(result);



