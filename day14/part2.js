var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var orMask = 0;
var memory = {};

for(var i in input) {
    var ii = input[i];

    var parts = ii.split(' = ');

    if (parts[0] == 'mask') {
        var or = 0;
        var n = 0;

        var floating = [];

        for(var m = parts[1].length-1; m >= 0; m--) {
            if (parts[1][m] == '1') {
                or += Math.pow(2, n);
            }
            if (parts[1][m] == 'X') {
                floating.push(Math.pow(2, n));
            }
            n++;
        }

        orMask = or;

    } else {
        var memAddress = parseInt(parts[0].match(/(\d+)/)[1]);
        memAddress = BigInt(memAddress) | BigInt(orMask);
        
        function permute(mem, fs, i) {
            if (i >= fs.length) return;
            
            var trueMem = mem | BigInt(fs[i]);
            memory[trueMem] = parseInt(parts[1]);
            permute(trueMem, fs, i+1);

            falseMem = mem & (BigInt(Math.pow(2, 36) - 1) - BigInt(fs[i]));
            memory[falseMem] = parseInt(parts[1]);
            permute(falseMem, fs, i+1);
        }

        permute(memAddress, floating, 0);
    }
}

var sum = 0;

for (var m in memory) {
    sum += memory[m];
}

console.log(sum);
