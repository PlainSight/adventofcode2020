var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

outer: for (var mod = 0; mod < input.length; mod++) {
    var PC = 0;
    var acc = 0;

    var executedIndexes = {};

    while(PC < input.length) {
        var instruction = input[PC];

        var si = instruction.split(' ');

        if (executedIndexes[PC]) {
            continue outer;
        }

        executedIndexes[PC] = true;

        var opcode = si[0];
        
        if (PC == mod) {
            if (opcode == 'jmp') {
                opcode = 'nop';
            } else {
                if (opcode == 'nop') {
                    opcode = 'jmp';
                }
            }
        }

        switch (opcode) {
            case 'jmp':
                PC += parseInt(si[1]);
                break;
            case 'acc':
                acc += parseInt(si[1]);
            case 'nop':
                PC++;
        }
    }

    console.log(acc);
}