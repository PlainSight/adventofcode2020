var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var rawRules = input[0].split('\r\n');
var messages = input[1].split('\r\n');

var rules = {};

for (var r in rawRules) {
    var rule = rawRules[r].split(':');

    var ruleId = parseInt(rule[0]);
    var ruleParts = rule[1].trim().split('|').map(m => m.trim().split(' ').map(n => n.includes('"') ? n.replace(/"/g, '') : parseInt(n)));

    //console.log(ruleId, ruleParts);

    rules[ruleId] = ruleParts;
}

var reverseRules = {};

for (var r in rules) {
    var rule = rules[r];

    for(var rp in rule) {
        for (var rpv in rule[rp]) {
            var ruleParentValue = rule[rp][rpv];
            if(!reverseRules[ruleParentValue]) {
                reverseRules[ruleParentValue] = [];
            }
            reverseRules[ruleParentValue].push({ parent: r, pos: parseInt(rpv) });
        }
    }
}

//console.log(reverseRules);

// checks a character and returns a rule tree which matches that string
function checkCharacter(character, position, tree) {


}

function makeTree(character, position) {
    var children = [];
    
    for(var e in reverseRules[character]) {
        var entry = reverseRules[character][e];

        if (entry.pos <= position) {
            var newTree = makeTree(entry.parent, position - entry.pos);
            if (newTree) {
                children.push(newTree);
            }
        }
    }

    var node = {
        rule: character,
        position: position,
        children: children
    };

    if (node.rule == '0' || node.children.length > 0) {
        return node;
    }

    return null;
}


for (var m in messages) {
    var message = messages[m].split('');

    var good = true;

    var validRulesForPosition = [];

    for (var c in message) {
        var char = message[c];
        // if (makeTree(char, c) == null) {
        //     good = false;
        // }
        var validRulesForCharacter = makeTree(char, c);

        function walkTree(rule, chosen) {
            chosen = chosen.map(m => m).unshift(rule.rule);
            if (rule.rule != '0') {
                for (var c in rule.children) {
                    var child = rule.children[c];

                    return walkTree(child, chosen);
                }
            } else {
                validRulesForPosition.push()
            }
        }

        walkTree(validRulesForCharacter);

        console.log(char, JSON.stringify(validRulesForCharacter, null, 2));
    }

    return;

    // if (good) {
    //     console.log('WIN ', message);
    // } else {
    //     console.log('FAIL', message);
    // }
}