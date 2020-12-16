var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var rawRules = input[0].split('\r\n');

var rules = [];

for (var r = 0; r < rawRules.length; r++) {
    var values = rawRules[r].match(/(.+): (\d+)-(\d+) or (\d+)-(\d+)/);
    rules.push([
        {
            name: values[1],
            low: parseInt(values[2]),
            high: parseInt(values[3])
        },
        {
            name: values[1],
            low: parseInt(values[4]),
            high: parseInt(values[5])
        }
    ])
}

var yourTicket = input[1].split('\r\n')[1].split(',').map(m => parseInt(m));

var nearbyTickets = input[2].split('\r\n').slice(1);
var validTickets = [];

for(var t = 0; t < nearbyTickets.length; t++) {
    var ticket = nearbyTickets[t].split(',').map(m => parseInt(m));
    var validTicket = true;
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
            validTicket = false;
        }
    }
    if (validTicket) {
        validTickets.push(ticket);
    }
}

var validFieldsForOrder = [];

for (var p = 0; p < validTickets[0].length; p++) {
    validFieldsForOrder[p]  = {};
    for (var r = 0; r < rules.length; r++) {
        validFieldsForOrder[p][rules[r][0].name] = true;
    }
}

for (var t = 0; t < validTickets.length; t++) {
    var ticket = validTickets[t];
    for (var p = 0; p < ticket.length; p++) {
        var value = ticket[p];

        for (var r = 0; r < rules.length; r++) {
            if ((value >= rules[r][0].low && value <= rules[r][0].high) ||
            (value >= rules[r][1].low && value <= rules[r][1].high)) {
            } else {
                var ruleName = rules[r][0].name;
                validFieldsForOrder[p][ruleName] = false;
            }
        }
    }
}

var orderedFields = [];

var canReduce = true;

outer: while (canReduce) {
    canReduce = false;

    for(var o = 0; o < validFieldsForOrder.length; o++) {
        var trueEntries = Object.entries(validFieldsForOrder[o]).filter(t => t[1] == true);

        if (trueEntries.length == 1) {
            var fieldName = trueEntries[0][0];

            orderedFields[o] = fieldName;
            canReduce = true;

            for (var oo = 0; oo < validFieldsForOrder.length; oo++) {
                validFieldsForOrder[oo][fieldName] = false;
            }

            continue outer;
        }
    }
}

//console.log(orderedFields);
//console.log(yourTicket);

var result = 1;

for(var i = 0; i < orderedFields.length; i++) {
    if (orderedFields[i].startsWith('departure')) {
        result *= yourTicket[i];
    }
}

console.log(result);