$(function() {
    // handle credits button   
    var $credits = $('#credits').detach();
    $('#credits-modal').on('click', function() {
        createModal($credits, false);
    });    
});

/* 
 * Handles interactive dialog along the game 
 * Parameters: 
 *  1. boolean indicating wheter point were earned this turn or not
 *  1. boolean indicating wheter it was the player's turn or not
 */ 
function addDialog(wonPoints, playerTurn) {
    //determine whether player won points or not
    var points = '';
    if (wonPoints) {
        points = 'won';
    } else {
        points = 'lost';
    }
    // add the phrase
    $.getJSON( "js/json/dialog.json", function(data) {
        // choose a random number between 0 and 9 (used to select a phrase)
        var index = Math.floor(Math.random() * 9);
        // get phrase
        var phrase = data.dialog[points][index];
        // add to page
        var $phrase = $('<div id="phrase">' + phrase + '</div>')
        if (playerTurn) {
             // add phrase to player
            $phrase.css({
                position: 'absolute',
                top: $('#player img').offset().top - 60 + 'px',
                left: $('#player img').offset().left + 70 + 'px'
            });
            $('#player').append($phrase);
        } else {
             // add phrase to pig
            $phrase.css({
                position: 'absolute',
                top: $('#pig img').offset().top - 55  + 'px',
                left: $('#pig img').offset().left + 60 + 'px'
            });
            $('#pig').append($phrase);
        }
        // then fade it out
        setTimeout(function() {
            $phrase.fadeOut();
        }, 2000);
    });
}

/* Handles loading random facts along the game */ 
function getRandomFact() {
    // handle random facts each turn (there are 50 different facts)
    $.getJSON( "js/json/facts.json", function(data) {
        // choose a random number between 1 and 50 (used to select a fact)
        var index = Math.floor(Math.random() * 49);
        // get corresponding fact
        var fact = data.facts[index];
        // add to page
        $('#fact').text(fact);
    });
}