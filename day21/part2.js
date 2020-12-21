var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var foodItems = [];

for (var i in input) {
    var food = input[i];

    var parts =  food.split(' (contains ');

    var ingredients = parts[0].split(' ');
    var allergens = parts[1].replace(')', '').split(', ');

    foodItems.push({
        i: ingredients,
        a: allergens
    });
}

var couldContainAllergens = {};
var allIngredients = {};

for (var fi in foodItems) {
    var food = foodItems[fi];

    for (var al in food.a) {
        var allergen = food.a[al];

        food.i.forEach(ing => allIngredients[ing] = ing);

        var ingredientsWithPotentialAlergens = food.i.map(m => m);

        if (!couldContainAllergens[allergen]) {
            // we don't know anything about this alergen yet
            couldContainAllergens[allergen] = ingredientsWithPotentialAlergens;
        } else {
            // the food containing this alergen must lie in the intersection of these two sets

            var intersect = ingredientsWithPotentialAlergens.filter(a => couldContainAllergens[allergen].includes(a))

            couldContainAllergens[allergen] = intersect;
        }
        
    }
}

var allergensForFood = {};

while (Object.values(couldContainAllergens).filter(a => a.length > 0).length > 0) {
    var allergenWithOneIngredient = Object.entries(couldContainAllergens).filter(([k, v]) => v.length == 1)[0];
    var allergen = allergenWithOneIngredient[0];
    var ingredient = allergenWithOneIngredient[1][0];

    allergensForFood[allergen] = ingredient;

    for(var k in couldContainAllergens) {
        var v = couldContainAllergens[k];
        couldContainAllergens[k] = v.filter(i => i != ingredient);
    }
}

console.log(Object.entries(allergensForFood).sort((a, b) => a[0].localeCompare(b[0])).map(e => e[1]).join(','));
