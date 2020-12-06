var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var count = 0;
var set = {};
var numberInGroup = 0;

for(var i in input) {
	var line = input[i];

	for(var c = 0; c < line.length; c++) {
		if (set[line[c]]) {
			set[line[c]] += 1;
		} else {
			set[line[c]] = 1;
		}
		
	}

	if (line == '') {
		count += Object.values(set).filter(v => v == numberInGroup).length;
		set = {};
		numberInGroup = 0;
	} else {
		numberInGroup++;
	}
}

count += Object.values(set).filter(v => v == numberInGroup).length;

console.log(count);