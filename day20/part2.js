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

    data = t.slice(2, 10).map(s => s.split('').slice(1, 9));

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
        console.log('rotating tile ', tile2.order, tile2.id);
    }
}

var tilesWithTwoBorders = tiles.filter(t => t.borders.filter(b => borderToCheck(b)).length == 2);

console.log(tilesWithTwoBorders.length);

var queue = [tilesWithTwoBorders[0]];

tilesWithTwoBorders[0].x = 0;
tilesWithTwoBorders[0].y = 0;
tilesWithTwoBorders[0].placed = true;

var ds = [
    [0, 1],
    [1, 0],
    [0, -1],
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

console.log(tdim);

function getAt(tile, x, y) {
    var ss = [[0, 0], [tdim, 0], [tdim, tdim], [0, tdim]];
    var ssd = [
        [[1, 0], [0, 1]], 
        [[0, -1], [1, 0]], 
        [[-1, 0], [0, -1]], 
        [[0, 1], [-1, 0]]
    ];

    var xx = ss[tile.rotation][0] + (ssd[tile.rotation][0][0]*x) + (ssd[tile.rotation][0][1]*y);
    var yy = ss[tile.rotation][1] + (ssd[tile.rotation][1][0]*x) + (ssd[tile.rotation][1][1]*y);

    if (tile.flipped) {
        yy = tdim - yy;
    }

    //console.log('g', yy, xx);

    return tile.data[yy][xx];
}

console.log(`${minx} -- ${maxy}`);

for(var y = maxy; y >= miny; y--) {
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

for (var i = 0; i < 8; i++) {
    tiles[0].rotation = i % 4;
    tiles[0].flipped = (i / 2) >= 2;
    for (var y = 0; y <= tdim; y++) {
        var str = '';
        for(var x = 0; x <= tdim; x++) {
            str += getAt(tiles[0], x, y);
        }
        console.log(str);
    }
}
