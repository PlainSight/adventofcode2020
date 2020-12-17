var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var grid = new Map();

function toKey(arr) {
    return arr[0]+','+arr[1]+','+arr[2]+','+arr[3];
}

for(var y = 0; y < input.length; y++) {
    for (var x = 0; x < input[0].length; x++) {
        if (input[y][x] == '#') {
            grid.set(toKey([x, y, 0, 0]), [x, y, 0, 0]); 
        }
    }
}

var CYCLES = 6;

function getNeighbours(coordinate) {
    var neighbours = [];
    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            for (var z = -1; z <= 1; z++) {
                for (var w = -1; w <= 1; w++) {
                    if (x != 0 || y != 0 || z != 0 || w != 0) {
                        neighbours.push([coordinate[0]+x, coordinate[1]+y, coordinate[2]+z, coordinate[3]+w]);
                    }
                }
            }
        }
    }
    return neighbours;
}

for (var t = 1; t <= CYCLES; t++) {
    var lastGrid = grid;
    var nextGrid = new Map();
    var potentialGrid = new Map();

    for (const [k, v] of lastGrid.entries()) {
        potentialGrid.set(k, v);
        var neighbours = getNeighbours(v);
        for(var n in neighbours) {
            var nn = neighbours[n];
            potentialGrid.set(toKey(nn), nn);
        }
    }

    for (const [k, v] of potentialGrid.entries()) {
        var neighbours = getNeighbours(v);

        var currentlyActive = lastGrid.get(k) || false;

        var neighbourCount = 0;

        for (var n in neighbours) {
            var coordinate = neighbours[n];
            var neighbourActive = lastGrid.get(toKey(coordinate)) || false;

            if (neighbourActive) {
                neighbourCount++;
            }
        }

        if (currentlyActive) {
            if (neighbourCount == 2 || neighbourCount == 3) {
                nextGrid.set(k, v);
            }
        } else {
            if (neighbourCount == 3) {
                nextGrid.set(k, v);
            }
        }
    }

    grid = nextGrid;
}

console.log(grid.size);