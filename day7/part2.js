var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var rules = [];

for (var i in input) {
    var ii = input[i];

    //plaid coral bags contain 2 pale green bags, 2 faded tomato bags, 2 dark salmon bags, 1 vibrant magenta bag.

    var matches = ii.match(/(.+)\sbags contain\s(.+)/);

    var bagColour = matches[1];
    var contains = [];

    var containsRaw = matches[2];

    if (containsRaw != 'no other bags.') {
        var containsSplit = containsRaw.split(',');
        for(var c in containsSplit) {
            var cc = containsSplit[c];
            var cr = cc.match(/(\d)\s(.+)\sbag/);
            contains.push({
                n: parseInt(cr[1]),
                c: cr[2]
            });
        }
    }

    rules[bagColour] = contains;
}

function check(bc) {
    var count = 1;
    for (var i = 0; i < rules[bc].length; i++) {
        count += (rules[bc][i].n * check(rules[bc][i].c));
    }
    return count;
}

console.log(check('shiny gold') - 1);
