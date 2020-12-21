var fs = require('fs');

var input = fs.readFileSync('./sample.txt', 'utf8').split('\r\n\r\n');

var tiles = [];

function rotateArray(ar, num) {
     for (var n = 0; n < num; n++) {
        var end = ar.pop();
        ar.unshift(end);
    }
    return ar;
}

function flipArray(ar, dir) {
    if (dir == 'vertically') {
        return [ar[2], ar[1], ar[0], ar[3]];
    } else { //horizontally
        return [ar[0], ar[3], ar[2], ar[1]];
    }
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

    var data = [];

    // number all sides with least significant digits to the left;

    for(var y = 1; y < t.length; y++) {

        var rd = y-1;
        var ld = t.length-y-1;

        if (y >= 2 && y <= 9) {
            data.push(t[y].split('').slice(1, 9));
        }

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
        requiredNeighbours: 0,
        x: 0,
        y: 0,
        placed: false,
        rotationRequired: 0,
        data: data
    };

    tiles.push(tile);
}

var bordersByShared = {};

for (var t in tiles) {
    var tile = tiles[t];

    for (var b in tile.borders) {
        var border = tile.borders[b];

        if (!bordersByShared[border]) {
            bordersByShared[border] = 1;
        } else {
            bordersByShared[border]++;
        }
    }
}

for (var t in tiles) {
    var tile = tiles[t];

    var sharedBorders = 0;

    for (var b in tile.borders) {
        var border = tile.borders[b];

        sharedBorders += (bordersByShared[border] == 2 ? 1 : 0);
    }

    tile.requiredNeighbours = sharedBorders;
}

//console.log(tiles);

outer: while(tiles.filter(t => !t.placed).length > 0) {
    var placedTiles = tiles.filter(t => t.placed);
    var unplacedTiles = tiles.filter(t => !t.placed);

    if (placedTiles.length == 0) {
        tiles[0].placed = true;
        //console.log('placing tile', tiles[0]);
    } else {
        var toHaveNeighbour = placedTiles.filter(pt => pt.borderedBy.filter(b => b).length < pt.requiredNeighbours)[0];

        //console.log('get neighbour for', toHaveNeighbour);

        var borderIds = toHaveNeighbour.borders.map((v, i) => { return { v: v, i: i }}).filter(v => toHaveNeighbour.borderedBy[v.i] == false);

        for (var t in unplacedTiles) {
            var tile = unplacedTiles[t];

            for (var b in borderIds) {
                var borderId = borderIds[b].v;
                var borderIndex = borderIds[b].i; // index of border in placed tile

                //console.log('ee', borderId, borderIndex);

                if (tile.borders.includes(borderId)) {
                    var indexOfBorder = tile.borders.indexOf(borderId); // index of border in unplaced tile

                    var desiredIndexOfBorder = (borderIndex + 2) % 4

                    var rotationRequired = (desiredIndexOfBorder + 4 - indexOfBorder) % 4;

                    tile.borders = rotateArray(tile.borders, rotationRequired);
                    tile.borderedBy = rotateArray(tile.borderedBy, rotationRequired);
                    tile.rotationRequired = rotationRequired;

                    tile.borderedBy[desiredIndexOfBorder] = true;

                    toHaveNeighbour.borderedBy[borderIndex] = true;

                    tile.placed = true;
                    switch (desiredIndexOfBorder) {
                        case 0:
                            tile.x = toHaveNeighbour.x;
                            tile.y = toHaveNeighbour.y-1;
                        break;
                        case 1:
                            tile.x = toHaveNeighbour.x+1;
                            tile.y = toHaveNeighbour.y;
                        break;
                        case 2:
                            tile.x = toHaveNeighbour.x;
                            tile.y = toHaveNeighbour.y+1;
                        break;
                        case 3:
                            tile.x = toHaveNeighbour.x-1;
                            tile.y = toHaveNeighbour.y;
                        break;
                    }
                    //console.log('placing tile', placedTiles.length +1, tile);
                    continue outer;
                }
            }
        }
        // already placed
        toHaveNeighbour.borderedBy[0] = true;
        toHaveNeighbour.borderedBy[1] = true;
        toHaveNeighbour.borderedBy[2] = true;
        toHaveNeighbour.borderedBy[3] = true;
    }
}

// construct picture

var minx = Math.min(...tiles.map(t => t.x));
var miny = Math.min(...tiles.map(t => t.y));
var maxx = Math.max(...tiles.map(t => t.x));
var maxy = Math.max(...tiles.map(t => t.y));

console.log(minx, miny, maxx, maxy);

var picture = new Array(64 * tiles.length);

function destIndex(mx, my, x, y, mul) {
    var rx = (mx*8) + x;
    var ry = (my*8) + y;

    return (ry * mul) + rx
}

var picdim = 8*(1+maxx-minx);

for(var t in tiles) {
    var tile = tiles[t];

    console.log(tile);

    var minxdest = tile.x - minx;
    var minydest = tile.y - miny;

    var destx = 0;
    var desty = 0;
    switch (tile.rotationRequired) {
        case 0:
            for (var y = 0; y < 8; y++) {
                destx = 0;
                for (var x = 0; x < 8; x++) {
                    picture[destIndex(minxdest, minydest, destx, desty, picdim)] = tile.data[y][x];
                    destx++;
                }
                desty++;
            }
            break;
        case 1:
            for (var x = 0; x < 8; x++) {
                destx = 0;
                for (var y = 7; y >= 0; y--) {
                    picture[destIndex(minxdest, minydest, destx, desty, picdim)] = tile.data[y][x];
                    destx++;
                }
                desty++;
            }
            break;
        case 2:
            for (var x = 7; x >= 0; x--) {
                destx = 0;
                for (var y = 7; y >= 0; y--) {
                    picture[destIndex(minxdest, minydest, destx, desty, picdim)] = tile.data[y][x];
                    destx++;
                }
                desty++;
            }
            break;
        case 3:



            break;
    }
}



console.log(picdim);

for (var y = 0; y < picdim; y++) {
    console.log(picture.slice(picdim*y, picdim*(y+1)).join(''));
}