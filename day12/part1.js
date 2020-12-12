var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var x = 0;
var y = 0;
var facing = 'E';

function changeFacing(f, a) {
    var facings = ['N', 'E', 'S', 'W'];
    var aa = a / 90;
    var currentIndex = facings.indexOf(facing) + 4;
    if (f == 'L') {
        aa = -aa;
    }
    facing = facings[(currentIndex+aa) %4]
}

for(var i in input) {
    var instr = input[i];
    var parts = instr.match(/([A-Z])(\d+)/);
    var number = parseInt(parts[2]);

    switch (parts[1]) {
        case 'N':
            y += number;
            break;
        case 'S':
            y -= number;
            break;
        case 'E':
            x += number;
            break;
        case 'W':
            x -= number;
            break;
        case 'R':
            changeFacing('R', number);
            break;
        case 'L':
            changeFacing('L', number);
            break;
        case 'F':
            switch(facing) {
                case 'N':
                    y += number;
                    break;
                case 'S':
                    y -= number;
                    break;
                case 'E':
                    x += number;
                    break;
                case 'W':
                    x -= number;
                    break;
            }
    }
}

console.log(Math.abs(x) + Math.abs(y));