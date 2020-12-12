var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var seats = input.map(i => i.split(''));

function step() {
    var next = [];

    function visible(x, y) {
        var count = 0;
        var directions = [
            [1, 0],
            [1, 1],
            [0, 1],
            [-1, 1],
            [-1, 0],
            [-1, -1],
            [0, -1],
            [1, -1]
        ];

outer: for (var d = 0; d < directions.length; d++) {
            var xx = x+directions[d][0];
            var yy = y+directions[d][1];
            while(true) {
                if (xx < 0 || xx >= seats[0].length || yy < 0 || yy >= seats.length) {
                    continue outer;
                }
                if (seats[yy][xx] == '#') {
                    count++;
                    continue outer;
                }
                if (seats[yy][xx] == 'L') {
                    continue outer;
                }

                xx += directions[d][0];
                yy += directions[d][1];
            }
        }

        return count;
    }

    for (var y = 0; y < seats.length; y++) {
        var row = [];
        for (var x = 0; x < seats[0].length; x++) {
            var adjacent = visible(x, y);
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
                    if (adjacent >= 5) {
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