var fs = require('fs');
const { parse } = require('path');

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
            break outer;
        }
    }
}

{
    var start = 0;
    var end = 0;

    var sum = parseInt(input[start]);

    while (true) {
        if (sum == result) {
            var largest = 0;
            var smallest = Infinity;
            for (var x = start; x <= end; x++) {
                smallest = Math.min(parseInt(input[x]), smallest);
                largest = Math.max(parseInt(input[x]), largest);
            }
            console.log(smallest+largest);
            return;
        } else {
            if (sum < result) {
                // add one to the end
                end++;
                sum += parseInt(input[end]);
            } else {
                if (sum > result) {
                    // knock one off the front
                    sum -= parseInt(input[start]);
                    start++;
                }
            }
        }
    }
}

