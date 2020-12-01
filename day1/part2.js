var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

for(var i in input) {
	var m = +input[i];
	for(var j in input) {
		var n = +input[j];
		for(var k in input) {
			var o = +input[k];
			if (m+n+o == 2020) {
				console.log(m*n*o);
				return;
			}
		}
	}
}
