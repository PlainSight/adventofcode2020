var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var tiles = [];

var trim = 2;

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

    var len = t.length-2;

    var ss = [
        [0, 1],
        [len, 1],
        [len, len+1],
        [0, len+1]
    ];

    var es = [
        [len, 1],
        [len, len+1],
        [0, len+1],
        [0, 1]
    ];

    var ds = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1]
    ];

    var borders = [];
    var bordersPolarity = [];

    data = t.slice(2 - (!trim ? 1 : 0), 10 + (!trim ? 1 : 0)).map(s => s.split('').slice(1 - (!trim ? 1 : 0), 9 + (!trim ? 1 : 0)));

    ss.forEach((sss, ssi) => {
        var x = sss[0];
        var y = sss[1];

        var d = 0;
        var dd = len;

        var one = (t[y][x] == '#' ? 1 : 0) * Math.pow(2, d);
        var two = (t[y][x] == '#' ? 1 : 0) * Math.pow(2, dd);

        while (x != es[ssi][0] || y != es[ssi][1]) {
            x += ds[ssi][0];
            y += ds[ssi][1];
            d++;
            dd--;
            one += (t[y][x] == '#' ? 1 : 0) * Math.pow(2, d);
            two += (t[y][x] == '#' ? 1 : 0) * Math.pow(2, dd);
        }

        borders.push(Math.max(one, two));
        bordersPolarity.push(one > two);
    });

    var tile = {
        id: id,
        borders: borders,
        bordersPolarity: bordersPolarity,
        x: 0,
        y: 0,
        rotation: 0,    //clockwise always
        flipped: false,
        placed: false,
        order: 0,
        data: data
    };

    tiles.push(tile);
}

var tilesByBorder = tiles.reduce((a, c) => {
    c.borders.forEach(b => {
        a[b] = (a[b] || []);
        a[b].push(c);
    });
    return a;
}, {});

function borderToCheck(b) {
    return tilesByBorder[b] && tilesByBorder[b].length > 1;
}

function getNeighbour(tile, border) {
    return tilesByBorder[border].filter(t => t != tile)[0];
}

function polarityOfBorder(tile, border) {
    var index = tile.borders.indexOf(border);
    return tile.bordersPolarity[index];
}

function calculateFlip(tile1, tile2, border) {
    var polarity1 = polarityOfBorder(tile1, border);
    var polarity2 = polarityOfBorder(tile2, border);
    if (polarity1 == polarity2) {
        // flip
        tile2.flipped = true;
        tile2.bordersPolarity = tile2.bordersPolarity.map(a => !a);

        var bpt = tile2.bordersPolarity[2];
        tile2.bordersPolarity[2] = tile2.bordersPolarity[0];
        tile2.bordersPolarity[0] = bpt;

        var bt = tile2.borders[2];
        tile2.borders[2] = tile2.borders[0];
        tile2.borders[0] = bt;

        console.log('flipping tile ', tile2.order, tile2.id);
    }
} 

function calculateRotate(tile1, tile2, border) {
    var index1 = tile1.borders.indexOf(border);
    var index2 = tile2.borders.indexOf(border);
    var rotate = ((6 + index1) - index2) % 4;

    tile2.rotation = rotate;
    if (rotate != 0) {
        tile2.borders = rotateArray(tile2.borders, rotate);
        tile2.bordersPolarity = rotateArray(tile2.bordersPolarity, rotate);
        console.log('rotating tile ', tile2.order, 'by', rotate, tile2.id);
    }
}

var tilesWithTwoBorders = tiles.filter(t => t.borders.filter(b => borderToCheck(b)).length == 2);

console.log(tilesWithTwoBorders.length);

var queue = [tilesWithTwoBorders[0]];

tilesWithTwoBorders[0].x = 0;
tilesWithTwoBorders[0].y = 0;
tilesWithTwoBorders[0].placed = true;

var ds = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
];

var order = 1;

while(queue.length) {
    var currentTile = queue.pop();

    currentTile.borders.forEach((b, bi) => {
        if (borderToCheck(b)) {
            var neighbour = getNeighbour(currentTile, b);
            if (!neighbour.placed) {
                neighbour.order = order;
                calculateFlip(currentTile, neighbour, b);
                calculateRotate(currentTile, neighbour, b);
                delete tilesByBorder[b];
                neighbour.placed = true;
                neighbour.x = currentTile.x + ds[bi][0];
                neighbour.y = currentTile.y + ds[bi][1];
                order++;
                queue.push(neighbour);
            }
        }
    })
}

var minx = Math.abs(Math.min(...tiles.map(t => t.x)));
var miny = Math.abs(Math.min(...tiles.map(t => t.y)));

tiles.forEach(t => {
    t.x += minx;
    t.y += miny;
});

minx = Math.abs(Math.min(...tiles.map(t => t.x)));
miny = Math.abs(Math.min(...tiles.map(t => t.y)));
var maxx = Math.max(...tiles.map(t => t.x));
var maxy = Math.max(...tiles.map(t => t.y));

var tdim = tiles[0].data.length - 1;

var ldim = tdim+1;

function getAt(tile, x, y) {
    var ss = [[0, 0], [0, tdim], [tdim, tdim], [tdim, 0]];
    var ssd = [
        [[1, 0], [0, 1]], 
        [[0, 1], [-1, 0]],
        [[-1, 0], [0, -1]],
        [[0, -1], [1, 0]] 
    ];

    var rot = tile.rotation;

    if (tile.flipped) {
        y = tdim - y;
        rot = (4 - rot) % 4;
    }

    
    var xx = ss[rot][0] + (ssd[rot][0][0]*x) + (ssd[rot][0][1]*y);
    var yy = ss[rot][1] + (ssd[rot][1][0]*x) + (ssd[rot][1][1]*y);

    return tile.data[yy][xx];
}

console.log(`${minx} -- ${maxy}`);

for(var y = miny; y <= maxy; y++) {
    var str = `${y} `;
    for(var x = minx; x <= maxx; x++) {
        var ct = tiles.filter(t => t.x == x && t.y == y)[0];
        if (ct) {
            str += (ct.order%10);
        } else {
            str += '.';
        }
    }
    console.log(str);
}

// for (var i = 0; i < 8; i++) {
//     tiles[0].rotation = i % 4;
//     tiles[0].flipped = (i / 2) >= 2;
//     for (var y = 0; y <= tdim; y++) {
//         var str = '';
//         for(var x = 0; x <= tdim; x++) {
//             str += getAt(tiles[0], x, y);
//         }
//         console.log(str);
//     }
// }

var tilesByIndex = tiles.reduce((a, c) => {
    a[c.x+','+c.y] = c;
    return a;
}, {});

function getAtGlobal(gx, gy, rot, flipped, max) {
    var xx = 0;
    var yy = 0;
    {
        var ss = [[0, 0], [0, max-1], [max-1, max-1], [max-1, 0]];
        var ssd = [
            [[1, 0], [0, 1]], 
            [[0, 1], [-1, 0]],
            [[-1, 0], [0, -1]],
            [[0, -1], [1, 0]] 
        ];

        if (flipped) {
            gy = (max-1) - gy;
        }

        xx = ss[rot][0] + (ssd[rot][0][0]*gx) + (ssd[rot][0][1]*gy);
        yy = ss[rot][1] + (ssd[rot][1][0]*gx) + (ssd[rot][1][1]*gy);
    }

    var tx = Math.floor(xx/(ldim));
    var ty = Math.floor(yy/(ldim));
    return getAt(tilesByIndex[tx+','+ty], xx%ldim, yy%ldim);
}

var xmax = (maxx+1)*(ldim);
var ymax = (maxy+1)*(ldim);

var mask = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `.split('\n').map(l => l.split(''));

var bestCount = 0;

for (var f = 0; f < 2; f++) {
    for (var r = 0; r < 4; r++) {
        var complete = [];
        for (var y = 0; y < ymax; y++) {
            if (trim == 0 && y % ldim == 0) {
                complete.push([' ']);
            }
            var row = [];
            for (var x = 0; x < xmax; x++) {
                if (trim == 0 && x % ldim == 0) {
                    row.push(' ');
                }
                row.push(getAtGlobal(x, y, r, f == 1, xmax));
            }
            complete.push(row);
        }

        if (trim == 0) {
            complete.forEach(c => {
                console.log(c.join(''));
            });
            console.log(' ');

            return;
        }

        var found = false;

        for(var y = 0; y < ymax; y++) {
            for(var x = 0; x < xmax; x++) {

                var misses = 0;

                for(var yy = 0; yy < mask.length; yy++) {
                    for(var xx = 0; xx < mask[0].length; xx++) {
                        if (mask[yy][xx] == '#') {
                            if ((y + yy) < ymax && (x + xx) < xmax && complete[y+yy][x+xx] == '#') {

                            } else {
                                misses++;
                            }
                        }
                    }
                }

                if (misses == 0) {
                    found = true;
                    for(var yy = 0; yy < mask.length; yy++) {
                        for(var xx = 0; xx < mask[0].length; xx++) {
                            if (mask[yy][xx] == '#') {
                                if (y + yy < ymax && x + xx < xmax && complete[y+yy][x+xx] == '#') {
                                    complete[y+yy][x+xx] = 'O';
                                }
                            }
                        }
                    }
                }
            }
        }

        var count = complete.reduce((a, c) => {
            return a + c.reduce((aa, cc) => {
                return aa + (cc == '#' ? 1 : 0);
            }, 0)
        }, 0);

        if (found) {
            bestCount = count;

            complete.forEach(c => {
                console.log(c.join(''));
            });
            console.log(' ');
        }
    }
}

console.log(bestCount);