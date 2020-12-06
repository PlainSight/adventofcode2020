var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var count = 0;
var set = {};

for(var i in input) {
	var line = input[i];

	for(var c = 0; c < line.length; c++) {
		set[line[c]] = true;
	}

	if (line == '') {
		count += Object.keys(set).length;
		set = {};
	}
}

count += Object.keys(set).length;

console.log(count);