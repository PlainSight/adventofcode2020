var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var wx = 10;
var wy = 1;
var x = 0;
var y = 0;

function rotateWayPoint(f, a) {
    var rotations = a / 90;
    if (f == 'L') {
        rotations = 4-rotations;
    }

    var rx = wx - x;
    var ry = wy - y;
    // relative to x, y

    for(var r = 0; r < rotations; r++) {
        rxt = rx;
        ryt = ry;
        rx = 1 * ryt;
        ry = -1 * rxt;
    }

    wx = x + rx;
    wy = y + ry;
}

for(var i in input) {
    var instr = input[i];
    var parts = instr.match(/([A-Z])(\d+)/);
    var number = parseInt(parts[2]);

    switch (parts[1]) {
        case 'N':
            wy += number;
            break;
        case 'S':
            wy -= number;
            break;
        case 'E':
            wx += number;
            break;
        case 'W':
            wx -= number;
            break;
        case 'R':
            rotateWayPoint('R', number);
            break;
        case 'L':
            rotateWayPoint('L', number);
            break;
        case 'F':
            var rx = wx - x;
            var ry = wy - y;
            x += (number * rx);
            y += (number * ry);
            wx = x + rx;
            wy = y + ry;
            break;
    }

    //console.log(x, y, wx, wy);

}

console.log(Math.abs(x) + Math.abs(y));