var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var sorted = input.map(n => parseInt(n)).sort((a, b) => a - b);
sorted.unshift(0);
sorted.push(Math.max(...sorted)+3);

var diffs = [0, 0, 0, 0];

for(var i = 1; i < sorted.length; i++) {
    var diff = sorted[i]-sorted[i-1];

    diffs[diff]++;
}

console.log(diffs[1] * diffs[3]);