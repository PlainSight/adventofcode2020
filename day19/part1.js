const { match } = require('assert');
var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var rawRules = input[0].split('\r\n');
var messages = input[1].split('\r\n');

var rules = {};
var reverseRules = {};

for (var r in rawRules) {
    var rule = rawRules[r].split(':');

    var ruleId = parseInt(rule[0]);
    var ruleParts = rule[1].trim().split('|').map(m => m.trim().split(' ').map(n => n.includes('"') ? n.replace(/"/g, '') : parseInt(n)));

    rules[ruleId] = ruleParts;
}

for (var r in rules) {
    var rule = rules[r];

    for (var rp in rule) {
        var rulePart = rule[rp];

        var key = k(rulePart);
        reverseRules[key] = parseInt(r);
    }
}

function rk(s) {
    return s.split(',').map(m => parseInt(m));
}

function k(...vals) {
    return vals.join(',');
}

var matches = 0;

for (var m in messages) {
    var message = messages[m].split('');

    var P = new Map();

    for (var s = 0; s < message.length; s++) {
        for (var r in rules) {
            var rule = rules[r];
            if (rule[0][0] == message[s]) {
                P.set(k(1, s, r), true);
            }
        }
    }

    for (var l = 2; l <= message.length; l++) { // length of strings
        for (var s = 0; s <= message.length-l; s++) { // start point of substring of length l
            for (var p = 1; p < l; p++) { // end point of substring of length l
                for (var r in rules) {
                    //console.log(l, '#', p, l-p, '#', s, s+p);

                    var rule = rules[r];
                    for (var rp in rule) {
                        var rulePart = rule[rp];

                        //console.log('checking rule', r, rulePart, 'against', )

                        if (P.get(k(p, s, rulePart[0])) && P.get(k(l-p, s+p, rulePart[1]))) {
                            P.set(k(l, s, r), true);
                        }
                    }
                }
            }
        }
    }

    //console.log(messages[m]);
    console.log(rules);
    //console.log(P);

    if (P.get(k(message.length, 0, 0))) {
        matches++;
        console.log(m, matches);
        //console.log(message, 'good');
    } else {
        console.log(m, matches);
        //console.log(message, 'bad');
    }

}

console.log(matches);
