var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var busIds = input[1].split(',').map((m, i) => {
    return {
        id: m != 'x' ? parseInt(m) : -1,
        offset: i
    };
}).filter(f => f.id >= 0).sort((a, b) => a.id - b.id);

console.log(busIds);

function modularInverse(a, mod) {
    for(var i = 0; i < mod; i++) {
        if ((i * a) % mod == 1) {
            return i;
        }
    }
    return 0;
}

var sum = BigInt(0);

var bigm = busIds.reduce((r0, r1) => {
    return { id: r0.id * r1.id };
}, { id: 1 }).id;

for(var i = 0; i < busIds.length; i++) {
    var a = ((busIds[i].offset*busIds[i].id) - busIds[i].offset) % busIds[i].id;
    var b = bigm / busIds[i].id;
    var bprime = modularInverse(b, busIds[i].id);
    sum += ((BigInt(a)*BigInt(b)*BigInt(bprime)));
}

console.log(sum, bigm, sum % BigInt(bigm));

