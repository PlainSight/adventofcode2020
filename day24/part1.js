var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var tileMap = {};

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

var result = 0;

for (var k in tileMap) {
    var v = tileMap[k];
    if (v == 'black') {
        result++;
    }
}

console.log(result);