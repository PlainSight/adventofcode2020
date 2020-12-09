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

for(var c = 25; c < input.length; c++) {
    if(!checkValid(parseInt(input[c]), c)) {
        console.log(parseInt(input[c]));
    } 
}