var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var slopes = [
	{	x: 1,	y: 1	},
	{	x: 3,	y: 1	},
	{	x: 5,	y: 1	},
	{	x: 7,	y: 1	},
	{	x: 1,	y: 2	}
]

var result = 1;

for (var s in slopes) {
	var trees = 0;

	var sx = slopes[s].x;
	var sy = slopes[s].y;

	var x = 0;

	for(var y = 0; y < input.length; y += sy) {
		var xmax = input[y].length;

		if (input[y][x % xmax] == '#') {
			trees++;
		}

		x += sx;
	}

	result *= trees;
}

console.log(result);