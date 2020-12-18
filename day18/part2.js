var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var result = 0;

for (var i in input) {
    var line = input[i];

    var parts = line.split('').filter(m => m != ' ');

    var stack = [];

    var index = 0;

    function readBlock() {
        while(index < parts.length) {
            if(evaluate() > 0) {
                return;
            }
        }
    }

    function evaluate() {
        var part = parts[index];

        switch(part) {
            case '*':
                index++;
                readBlock();
                var a = stack.pop();
                var b = stack.pop();
                stack.push(a*b);
                return 1;
            case '+':
                index++;
                evaluate();
                var a = stack.pop();
                var b = stack.pop();
                stack.push(a+b);
                break;
            case ')':
                index++;
                return 1;
            case '(':
                index++;
                readBlock();
                break;
            default:
                index++;
                stack.push(parseInt(part));
                break;
        }
        return 0;
    }

    readBlock();
    result += stack[0];
}

console.log(result);