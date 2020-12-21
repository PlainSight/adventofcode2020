var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var tiles = [];

function rotateArray(ar, num) {
     for (var n = 0; n < num; n++) {
        var end = ar.pop();
        ar.unshift(end);
    }
    return ar;
}

for(var i in input) {
    var t = input[i].split('\r\n');

    var id = t[0].match(/Tile (\d+):/)[1];

    var left1 = 0;
    var left2 = 0;
    var right1 = 0;
    var right2 = 0;
    var top1 = 0;
    var top2 = 0;
    var bottom1 = 0;
    var bottom2 = 0;

    // number all sides with least significant digits to the left;

    for(var y = 1; y < t.length; y++) {

        var rd = y-1;
        var ld = t.length-y-1;

        if (t[y][t[y].length-1] == '#') {
            right1 += Math.pow(2, rd);
            right2 += Math.pow(2, ld);
        }

        if (t[y][0] == '#') {
            left1 += Math.pow(2, rd);
            left2 += Math.pow(2, ld);
        }

        if (y == 1) {
            var d = 0;
            for(var x = 0; x < t[y].length; x++) {
                if (t[y][x] == '#') {
                    top1 += Math.pow(2, d);
                }
                d++;
            }
            d = 0;
            for(var x = t[y].length-1; x >= 0; x--) {
                if (t[y][x] == '#') {
                    top2 += Math.pow(2, d);
                }
                d++;
            }
        }

        if (y == t.length - 1) {
            var d = 0;
            for(var x = t[y].length-1; x >= 0; x--) {
                if (t[y][x] == '#') {
                    bottom1 += Math.pow(2, d);
                }
                d++;
            }
            d = 0;
            for(var x = 0; x < t[y].length; x++) {
                if (t[y][x] == '#') {
                    bottom2 += Math.pow(2, d);
                }
                d++;
            }
        }
    }

    var tile = {
        id: id,
        borders: [Math.max(top1, top2), Math.max(right1, right2), Math.max(bottom1, bottom2), Math.max(left1, left2)],
        borderedBy: [false, false, false, false],
        x: 0,
        y: 0,
        placed: false
    };

    tiles.push(tile);
}

var bordersByShared = {};

for (var t in tiles) {
    var tile = tiles[t];

    for (var b in tile.borders) {
        var border = tile.borders[b];

        if (border == 0) {
            console.log('b', tile.id);
        }

        if (!bordersByShared[border]) {
            bordersByShared[border] = 1;
        } else {
            bordersByShared[border]++;
        }
    }
}

//console.log(bordersByShared);

var result = BigInt(1);

for (var t in tiles) {
    var tile = tiles[t];

    var sharedBorders = 0;

    for (var b in tile.borders) {
        var border = tile.borders[b];

        sharedBorders += (bordersByShared[border] == 2 ? 1 : 0);
    }

    if (sharedBorders == 2) {
        console.log('id', tile.id);
        result *= BigInt(tile.id);
    }
}

console.log(result);

console.log(tiles.length, Object.values(bordersByShared).filter(v => v == 1).length, Object.values(bordersByShared).filter(v => v == 2).length);

// outer: while(tiles.filter(t => !t.placed)) {
//     var placedTiles = tiles.filter(t => t.placed);
//     var unplacedTiles = tiles.filter(t => !t.placed);

//     if (placedTiles.length == 0) {
//         tiles[0].placed = true;
//     } else {
//         var toHaveNeighbour = placedTiles.filter(pt => pt.borderedBy.includes(false))[0];

//         for (var t in unplacedTiles) {
//             var tile = unplacedTiles[t];

//             if (tile.borders.includes())
//         }
//     }
// }
