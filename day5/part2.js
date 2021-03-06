var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var ids = [];

for (var i in input) {
	var rtop = 127;
	var rbot = 0;

	var ctop = 7;
	var cbot = 0;

	var ii = input[i];

	for(var j = 0; j < 7; j++) {
		if (ii[j] == 'B') {
			rbot = Math.floor((rbot + rtop) / 2);
		} else {
			rtop = Math.floor((rbot + rtop) / 2);
		}
	}
	for(var j = 7; j < 10; j++) {
		if (ii[j] == 'R') {
			cbot = Math.floor((cbot + ctop) / 2);
		} else {
			ctop = Math.floor((cbot + ctop) / 2);
		}
	}

	var row = rtop;
	var col = ctop;

	var id = (row * 8) + col;

	ids.push(id);
}

ids = ids.sort((a, b) => a-b);

for (var i = 0; i < ids.length - 1; i++) {
	if (ids[i] != ids[i+1] - 1) {
		console.log(ids[i]+1);
	}
}