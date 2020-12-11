var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var seats = input.map(i => i.split(''));

function step() {
    var next = [];

    function adj(x, y) {
        var minx = Math.max(x-1, 0);
        var maxx = Math.min(x+1, seats[0].length-1);
        var miny = Math.max(y-1, 0);
        var maxy = Math.min(y+1, seats.length-1);
        var count = 0;
        for (var xx = minx; xx <= maxx; xx++) {
            for (var yy = miny; yy <= maxy; yy++) {
                if (xx == x && yy == y) {
                    continue;
                }
                if (seats[yy][xx] == '#') {
                    count++;
                }
            }
        }
        return count;
    }

    for (var y = 0; y < seats.length; y++) {
        var row = [];
        for (var x = 0; x < seats[0].length; x++) {
            var adjacent = adj(x, y);
            switch(seats[y][x]) {
                case '.':
                    row.push('.');
                    break;
                case 'L':
                    if (adjacent == 0) {
                        row.push('#');
                    } else {
                        row.push('L');
                    }
                    break;
                case '#':
                    if (adjacent >= 4) {
                        row.push('L')
                    } else {
                        row.push('#');
                    }
                    break;
            }
        }
        next.push(row);
    }

    seats = next;
}

function countOccupied() {
    var count = 0;
    for (var y = 0; y < seats.length; y++) {
        for (var x = 0; x < seats[0].length; x++) {
            if (seats[y][x] == '#') {
                count++;
            }
        }
    }
    return count;
}

var lastCount = -1;

while(lastCount != countOccupied()) {
    lastCount = countOccupied();
    step();
    //console.log(seats);
}

console.log(lastCount);