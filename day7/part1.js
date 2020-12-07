var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var rules = [];
var carriedBy = {};

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
            if(carriedBy[cr[2]]) {
                carriedBy[cr[2]].push(bagColour);
            } else {
                carriedBy[cr[2]] = [ bagColour ];
            }
        }
    }

    rules[bagColour] = contains;
}

var distinctAncestors = {};

function check(bc) {
    if (!carriedBy[bc]) {
        return;
    }
    for (var i = 0; i < carriedBy[bc].length; i++) {
        distinctAncestors[carriedBy[bc][i]] = true;
        check(carriedBy[bc][i]);
    }
}

check('shiny gold');

console.log(Object.keys(distinctAncestors).length);