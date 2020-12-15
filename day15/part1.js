var fs = require('fs');

var startingNumbers = fs.readFileSync('./input.txt', 'utf8').split(',').map(m => parseInt(m));

var spokenNumbers = {};

var lastSpokenNumber = 0;

function recordSpeaking(x, time) {
    if (spokenNumbers[x]) {
        if (spokenNumbers[x].length == 1) {
            spokenNumbers[x].push(time);
        } else {
            spokenNumbers[x].push(time);
            spokenNumbers[x].shift();
        }
    } else {
        spokenNumbers[x] = [time];
    }
}

for(var i = 0; i < 2020; i++) {
    if (i < startingNumbers.length) {
        var num = startingNumbers[i];
        recordSpeaking(num, i);
        lastSpokenNumber = num;
    } else {
        if (spokenNumbers[lastSpokenNumber].length == 1) { // newly spoken number
            lastSpokenNumber = 0;
        } else { // repeated number
            lastSpokenNumber = (spokenNumbers[lastSpokenNumber][1] - spokenNumbers[lastSpokenNumber][0]);
        }
        recordSpeaking(lastSpokenNumber, i);

    }
}

console.log(lastSpokenNumber);