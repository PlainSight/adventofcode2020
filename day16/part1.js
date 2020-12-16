var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var rawRules = input[0].split('\r\n');

var rules = [];

for (var r = 0; r < rawRules.length; r++) {
    var values = rawRules[r].match(/.+ (\d+)-(\d+) or (\d+)-(\d+)/);
    rules.push([
        {
            low: parseInt(values[1]),
            high: parseInt(values[2])
        },
        {
            low: parseInt(values[3]),
            high: parseInt(values[4])
        }
    ])
}

var yourTicket = input[1].split('\r\n')[1];

var nearbyTickets = input[2].split('\r\n').slice(1);

var invalidValues = 0;

for(var t = 0; t < nearbyTickets.length; t++) {
    var ticket = nearbyTickets[t].split(',').map(m => parseInt(m));

    for (var p = 0; p < ticket.length; p++) {
        var value = ticket[p];

        var valid = false;
        for (var r = 0; r < rules.length; r++) {
            if ((value >= rules[r][0].low && value <= rules[r][0].high) ||
            (value >= rules[r][1].low && value <= rules[r][1].high)) {
                valid = true;
            }
        }
        if (!valid) {
            invalidValues += value;
        }
        
    }
}

console.log(invalidValues);

//console.log(rules, yourTicket, nearbyTickets);