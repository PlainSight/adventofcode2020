var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var tileMap = {};

function adjacentTiles(tileCoord) {
    var adj = [];

    var diffs = [
        [1, 0],
        [-1, 0],
        [0, -1],
        [0, 1],
        [-1, 1],
        [1, -1]
    ];

    var xy = tileCoord.split(',').map(m => parseInt(m));

    for(var n = 0; n < diffs.length; n++) {
        adj.push((xy[0]+diffs[n][0]) +',' + (xy[1]+diffs[n][1]));
    }

    return adj;
}

function allCandidateTiles(currentMap) {
    var possibleTilesToFlip = {};
    
    for (var k in currentMap) {
        var adjToCurrent = adjacentTiles(k);

        for (var a in adjToCurrent) {
            possibleTilesToFlip[adjToCurrent[a]] = true;
        }
    }

    return possibleTilesToFlip;
}

for (var i in input) {
    var instruction = input[i];

    var stored = '';

    var x = 0;
    var y = 0;
    for (var n = 0; n < instruction.length; n++) {
        //e, se, sw, w, nw, and ne
        var char = instruction[n];

        if (char == 's' || char == 'n') {
            stored = char;
        } else {
            var dir = stored + char;
            // up is negative, down is positive

            switch (dir) {
                case 'e':
                    x++;
                    break;
                case 'se':
                    y++;
                    break;
                case 'sw':
                    y++;
                    x--;
                    break;
                case 'w':
                    x--;
                    break;
                case 'nw':
                    y--;
                    break;
                case 'ne':
                    y--;
                    x++;
                    break;
            }


            stored = '';
        }
    }

    if (tileMap[x+','+y]) {
        tileMap[x+','+y] = (tileMap[x+','+y] == 'black') ? 'white': 'black';
    } else {
        tileMap[x+','+y] = 'black';
    }
}

var DAYS = 100;

for (var n = 0; n < DAYS; n++) {
    var candidateTiles = allCandidateTiles(tileMap);
    var newTileMap = {};

    for (var c in candidateTiles) {
        var at = adjacentTiles(c);
        var blackTiles = 0;
        for (var a in at) {
            var adjacentCoord = at[a];
            var currentTile = tileMap[adjacentCoord];
            if (currentTile == 'black') {
                blackTiles++;
            }
        }
        if (tileMap[c] == 'white' || !tileMap[c]) {
            newTileMap[c] = blackTiles == 2 ? 'black' : 'white';
        }
        if (tileMap[c] == 'black') {
            newTileMap[c] = (blackTiles == 0 || blackTiles > 2) ? 'white' : 'black'; 
        }
    }

    tileMap = newTileMap;
}

var result = 0;

for (var k in tileMap) {
    var v = tileMap[k];
    if (v == 'black') {
        result++;
    }
}

console.log(result);