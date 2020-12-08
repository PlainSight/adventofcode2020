var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var PC = 0;
var acc = 0;

var executedIndexes = {};

while(true) {
    var instruction = input[PC];

    var si = instruction.split(' ');

    if (executedIndexes[PC]) {
        console.log(acc);
        return;
    }

    executedIndexes[PC] = true;

    switch (si[0]) {
        case 'jmp':
            PC += parseInt(si[1]);
            break;
        case 'acc':
            acc += parseInt(si[1]);
        case 'nop':
            PC++;
    }
}