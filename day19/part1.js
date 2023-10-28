var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var rawRules = input[0].split('\r\n');
var messages = input[1].split('\r\n');

var rules = {};

for (var r in rawRules) {
    var rule = rawRules[r].split(':');

    var ruleId = parseInt(rule[0]);
    var ruleParts = rule[1].trim().split('|').map(m => m.trim().split(' ').map(n => n.includes('"') ? n.replace(/"/g, '') : parseInt(n)));

    rules[ruleId] = ruleParts;
}

function checkRule(id, string, index) {
    var rule = rules[id];
    //console.log('checking rule ', rule, ' on ', string, 'at', index);
    var successes = [];
outer: for(var rr = 0; rr < rule.length; rr++) {
        var option = rule[rr];
        var lis = [ index ];

        for (var c = 0; c < option.length; c++) {
            if (lis.length == 0) {
                continue outer;
            }
            var newlis = [];
            lis.forEach(li => {
                var cond = option[c];
                if (/[ab]/.test(cond)) {
                    if (string[li] == cond) {
                        newlis.push(li+1);
                    }
                } else {
                    var res = checkRule(cond, string, li);
                    newlis.push(...res);
                }
            });
            lis = newlis;
        }

        successes.push(...lis);
    }

    //console.log('returning', successes);

    return successes;
}

var goodMessages = 0;

messages.forEach(m => {
    goodMessages += checkRule(0, m, 0).includes(m.length) ? 1 : 0;
    //console.log('RESULT', m,);
});

console.log(goodMessages);