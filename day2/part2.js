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

	var first = password.split('')[ruleLow-1];
	var second = password.split('')[ruleHigh-1];

	var trueStatements = 0;

	if (first == letter) {
		trueStatements++;
	}

	if (second == letter) {
		trueStatements++;
	}

	if (trueStatements == 1) {
		goodPasswords++;
	}
}

console.log(goodPasswords);
