var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var validPassports = 0;

var validFeilds = [];

//byr (Birth Year)
//iyr (Issue Year)
//eyr (Expiration Year)
//hgt (Height)
//hcl (Hair Color)
//ecl (Eye Color)
//pid (Passport ID)

for (var i = 0; i < input.length; i++) {
	if (input[i] == '') {
		if (validFeilds.includes('byr') && 
		validFeilds.includes('iyr') && 
		validFeilds.includes('eyr') && 
		validFeilds.includes('hgt') && 
		validFeilds.includes('hcl') && 
		validFeilds.includes('ecl') && 
		validFeilds.includes('pid')) {
			validPassports++;
		}
		validFeilds = [];
	} else {
		if (input[i].includes('byr')) validFeilds.push('byr');
		if (input[i].includes('iyr')) validFeilds.push('iyr');
		if (input[i].includes('eyr')) validFeilds.push('eyr');
		if (input[i].includes('hgt')) validFeilds.push('hgt');
		if (input[i].includes('hcl')) validFeilds.push('hcl');
		if (input[i].includes('ecl')) validFeilds.push('ecl');
		if (input[i].includes('pid')) validFeilds.push('pid');
	}
}
if (validFeilds.includes('byr') && 
	validFeilds.includes('iyr') && 
	validFeilds.includes('eyr') && 
	validFeilds.includes('hgt') && 
	validFeilds.includes('hcl') && 
	validFeilds.includes('ecl') && 
	validFeilds.includes('pid')) {
		validFeilds = [];
		validPassports++;
	}


console.log(validPassports);