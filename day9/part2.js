var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

function checkValid (check, index) {
    for(var i = index - 25; i < index; i++) {
        for(var j = i+1; j < index; j++) {
            if (parseInt(input[i]) + parseInt(input[j]) == check) {
                return true;
            }
        }
    }
    return false;
}

var result = 0;

for(var c = 25; c < input.length; c++) {
    if(!checkValid(parseInt(input[c]), c)) {
        result = parseInt(input[c]);
        break;
    } 
}

console.log(result);

outer: for(var c = 0; c < input.length; c++) {
    var sum = 0;
    var smallest = Infinity;
    var largest = 0;
    for(var k = c; k < input.length; k++) {
        var current = parseInt(input[k]);
        if (current > largest) {
            largest = current;
        }
        if (current < smallest) {
            smallest = current;
        }
        sum += current;
        if (sum > result) {
            continue outer;
        }
        if (sum == result) {
            console.log(smallest + largest);
            return;
        }
    }
}