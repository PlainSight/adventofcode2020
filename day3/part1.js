var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var trees = 0;

var x = 0;
for(var y = 0; y < input.length; y++) {
	var xmax = input[y].length;

	if (input[y][x % xmax] == '#') {
		trees++;
	}

	x += 3;
}

console.log(trees);