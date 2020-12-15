var fs = require('fs');

var startingNumbers = fs.readFileSync('./input.txt', 'utf8').split(',').map(m => parseInt(m));

var spokenNumbers = []; spokenNumbers.length = 30000000;

var lastSpokenNumber = 0;

function recordSpeaking(x, time) {
    if (spokenNumbers[x]) {
        if (spokenNumbers[x][1] == -1) {
            spokenNumbers[x][1] = time;
        } else {
            spokenNumbers[x][0] = spokenNumbers[x][1];
            spokenNumbers[x][1] = time;
        }
    } else {
        spokenNumbers[x] = [ time, -1 ];
    }
}

for(var i = 0; i < 30000000; i++) {
    if (i < startingNumbers.length) {
        var num = startingNumbers[i];
        recordSpeaking(num, i);
        lastSpokenNumber = num;
    } else {
        if (spokenNumbers[lastSpokenNumber][1] == -1) { // newly spoken number
            lastSpokenNumber = 0;
        } else { // repeated number
            lastSpokenNumber = (spokenNumbers[lastSpokenNumber][1] - spokenNumbers[lastSpokenNumber][0]);
        }
        recordSpeaking(lastSpokenNumber, i);

    }
}

console.log(lastSpokenNumber);