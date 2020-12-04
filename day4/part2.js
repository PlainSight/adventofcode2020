var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var validPassports = 0;

var fields = [];

/*
byr (Birth Year) - four digits; at least 1920 and at most 2002.
iyr (Issue Year) - four digits; at least 2010 and at most 2020.
eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
hgt (Height) - a number followed by either cm or in:
If cm, the number must be at least 150 and at most 193.
If in, the number must be at least 59 and at most 76.
hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
pid (Passport ID) - a nine-digit number, including leading zeroes.
*/

function validFields() {
	var vf = [];
	fields.forEach(f => {
		switch(f.k) {
			case 'byr':
				if (f.v >= 1920 && f.v <= 2002) {
					vf.push('byr');
				}
				break;
			case 'iyr':
				if (f.v >= 2010 && f.v <= 2020) {
					vf.push('iyr');
				}
				break;
			case 'eyr':
				if (f.v >= 2020 && f.v <= 2030) {
					vf.push('eyr');
				}
				break;
			/*
			If cm, the number must be at least 150 and at most 193.
			If in, the number must be at least 59 and at most 76.
			*/
			case 'hgt':
				if (f.v.endsWith('cm')) {
					var htcm = f.v.replace('cm', '');
					if (htcm >= 150 && htcm <= 193) {
						vf.push('hgt');
					}
				}
				if (f.v.endsWith('in')) {
					var htin = f.v.replace('in', '');
					if (htin >= 59 && htin <= 76) {
						vf.push('hgt');
					}
				}
				break;
			case 'hcl':
				if (/#[a-f0-9]{6}/.test(f.v)) {
					vf.push('hcl');
				}
				break;
			case 'ecl':
				if (['amb','blu','brn','gry','grn','hzl','oth'].includes(f.v)) {
					vf.push('ecl');
				}
				break;
			case 'pid':
				if (/^[0-9]{9}$/.test(f.v)) {
					vf.push('pid');
				}
				break;
		}
	});
	var good = vf.includes('byr') && 
		vf.includes('iyr') && 
		vf.includes('eyr') && 
		vf.includes('hgt') && 
		vf.includes('hcl') && 
		vf.includes('ecl') && 
		vf.includes('pid');

	return good;
}

for (var i = 0; i < input.length; i++) {
	if (input[i] == '') {
		if (validFields()) {
			validPassports++;
		}
		fields = [];
	} else {
		input[i].split(' ').forEach(f => {
			var sf = f.split(':');
			fields.push({
				k: sf[0],
				v: sf[1]
			})
		})
	}
}
if (validFields()) {
	validPassports++;
}

console.log(validPassports);