var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

for(var i in input) {
	var m = +input[i];
	for(var j in input) {
		var n = +input[j];
		if (m+n == 2020) {
			console.log(m*n);
			return;
		}
	}
}
