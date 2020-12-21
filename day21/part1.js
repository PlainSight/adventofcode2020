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

//console.log(foodItems);

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

var cannotContainAllergens = Object.keys(allIngredients).filter(i => Object.values(couldContainAllergens).filter(aa => aa.includes(i)).length == 0);

var countOfNonAllergensInFood = 0;

foodItems.forEach(fi => fi.i.forEach(ing => {
    if (cannotContainAllergens.includes(ing)) {
        countOfNonAllergensInFood++;
    }
}));

console.log(countOfNonAllergensInFood);