var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var goodPasswords = 0;

for(var i in input) {
	var parts = input[i].split(':');
	var ruleParts = parts[0].split(' ');
	var password = parts[1].trim();

	var ruleCounts = ruleParts[0].split('-');
	var ruleLow = ruleCounts[0];
	var ruleHigh = ruleCounts[1];
	var letter = ruleParts[1];

	var count = password.split('').filter(l => l == letter).length;
	if (count >= ruleLow && count <= ruleHigh) {
		goodPasswords++;
	}
}

console.log(goodPasswords);
