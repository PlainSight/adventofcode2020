var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var andMask = 0;
var orMask = 0;
var memory = [];

for(var i in input) {
    var ii = input[i];

    var parts = ii.split(' = ');

    if (parts[0] == 'mask') {
        var and = Math.pow(2, 36) - 1;
        var or = 0;
        
        var n = 0;
        for(var m = parts[1].length-1; m >= 0; m--) {
            if (parts[1][m] == '1') {
                or += Math.pow(2, n);
            }
            if (parts[1][m] == '0') {
                and -= Math.pow(2, n);
            }
            n++;
        }

        andMask = and;
        orMask = or;

    } else {
        var memAddress = parseInt(parts[0].match(/(\d+)/)[1]);
        var value = (BigInt(parseInt(parts[1])) | BigInt(or)) & BigInt(and);
        if(value < 0) {
            console.log(value, parts[1], and, or);
        }

        memory[memAddress] = value;
    }

}

var sum = BigInt(0);

for (var m in memory) {
    sum += memory[m];
}

console.log(Number(sum));
