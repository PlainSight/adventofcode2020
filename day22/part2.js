var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var cards1 = input[0].split('\r\n');
cards1.shift();
var cards2 = input[1].split('\r\n');
cards2.shift();

var freshdeck1 = cards1.map(m => parseInt(m)).reverse();
var freshdeck2 = cards2.map(m => parseInt(m)).reverse();

var knownGames = new Map();

function playGame(deck1, deck2, top) {
    var d1Top = deck1.length-1;
    var d1Length = deck1.length;

    var d2Top = deck2.length-1;
    var d2Length = deck2.length;

    var knownOrders = new Map();
    
    while (deck1.length > 0 && deck2.length > 0) {
        if (!top) {
            if (!!knownOrders.get(deck1.join(',')+':'+deck2.join(','))) {
                return 1; // player 1 wins
            } else {
                knownOrders.set(deck1.join(',')+':'+deck2.join(','), true);
            }
        }

        var p1card = deck1.pop();
        var p2card = deck2.pop();

        var p1EnoughCards = p1card <= deck1.length;
        var p2EnoughCards = p2card <= deck2.length;

        var winningPlayerOfRound = 1;

        if (p1EnoughCards && p2EnoughCards) {
            // winner determined by recursion
            var freshp1deck = deck1.slice(deck1.length-p1card, deck1.length).map(m => m);
            var freshp2deck = deck2.slice(deck2.length-p2card, deck2.length).map(m => m);

            // non cached version
            //winningPlayerOfRound = playGame(freshp1deck, freshp2deck, false);

            var cacheKey = freshp1deck.join(',')+':'+freshp2deck.join(',');
            var cachedResult = knownGames.get(cacheKey);
            winningPlayerOfRound = !!cachedResult ? cachedResult : playGame(freshp1deck, freshp2deck, false);
            knownGames.set(cacheKey, winningPlayerOfRound);
        } else {
            if (p1card < p2card) {
                winningPlayerOfRound = 2;
            }
        }
    
        if (winningPlayerOfRound == 1) {
            deck1.unshift(p1card);
            deck1.unshift(p2card);
        } else {
            deck2.unshift(p2card);
            deck2.unshift(p1card);
        }
    }


    // scoring for top level decks
    if (top) {
        var finalScore = 0;

        if (deck1.length > 0) {
            var scoreMul = deck1.length;
            while (deck1.length) {
                finalScore += (deck1.pop() * scoreMul);
                scoreMul--;
            }
        } else {
            var scoreMul = deck2.length;
            while (deck2.length) {
                finalScore += (deck2.pop() * scoreMul);
                scoreMul--;
            }
        }

        return finalScore;
    } else {
        // set winner for all known states in this game
        return deck1.length > 0 ? 1 : 2;
    }
}

console.log(playGame(freshdeck1, freshdeck2, true));
