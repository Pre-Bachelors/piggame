$(function() {
    
    /* Game Logic */

    // get scores
    var scores = [0, 0],
        turn = 0,
        turnTotal = 0,
        gameWon = false;
    
    // get page elements
    // buttons
    var $roll = $('#roll'),
        $hold = $('#hold');
    // score holders
    var $playerScore = $('#pScore'),
        $pigScore = $('#cScore'),
        $turnTotal = $('#turnPoints');
    // columns (to indicate which player is active)
    var $playerCol = $('#right'),
        $pigCol = $('#left');


    /* Initialize the game */
    update();
    gameTurns();
    // load a random fact
    getRandomFact();
    
    
    /* Updates the HTML page */
    function update() {
        // update webpage
        $playerScore.text(scores[0]);
        $pigScore.text(scores[1]);
        $turnTotal.text(turnTotal);
        
        // indicate which player is active
        if (turn%2 == 0) { // player
            $pigCol.removeClass('active', 700);
            $playerCol.addClass('active', 700);
        } else { // pig
            $playerCol.removeClass('active', 700);
            $pigCol.addClass('active', 700);
        }
    }
    
    
    /* Checks if there is a winner */
     function checkWinner() {
        if ((scores[turn%2] + turnTotal) >= 100) {
            gameWon = true;
            endGame();
        }
     }
    
    
    /* Handles the Rolling action */
    function roll() {
        // generate random number between 1 and 6
        var rollNum = Math.floor(Math.random() * 6) + 1;
                     
        // update roll picture and hide caption
        $('#roll figure > figcaption').hide();
        $('#roll figure > img').attr("src", "res/dice/dice_" + rollNum + ".png");
                     
        // if gets 1, turn total = 0
        if (rollNum === 1) {
            // add a dialog line
            addDialog(false, !(turn%2));
            endTurn();
        } 
        else {
            // else add to turn total 
            turnTotal += rollNum;
            // update webpage
            update();
            checkWinner();
        }                                                                                               
    }
    

    /* Handles the Holding action */
    function hold() {
        if (turnTotal > 0) {
            // add turn total to points
            scores[turn%2] += turnTotal;           
            // add a dialog line
            addDialog(true, !(turn%2));
            endTurn();
        }
    }


    /* Handles ending each turn */
    function endTurn() {
        // prepare next turn
        turnTotal = 0;
        turn++;
        
        // update webpage
        update();
        
        // change roll picture to defaut (to indicate previous turn ended) and show caption
        setTimeout(function() {
                   $('#roll figure > img').delay(500).attr("src", "res/roll.png");
                   $('#roll figure > figcaption').fadeIn(100);
        }, 500);
        
        // load a different random fact
        getRandomFact();
        
        gameTurns();
    }

    
    /* Handles the Game's turns */
    function gameTurns() {        
        // handle turns
        if (turn%2 == 0) {
            // update player on webpage
            
            // add event listeners
            $roll.off().on('click', function(e) {
                e.preventDefault();                       
                roll();
            });
            $hold.off().on('click', function(e) {
                e.preventDefault();
                hold();
            });
       }
        else {
            // remove event listeners
            $roll.off();
            $hold.off();
            
            play();
        }
        
        // stop game if game won
        if (gameWon) {
            return;
        }
    }
    

    /* Handles the Game's AI */
    function play() {
        // difference between player and ai scores
        var scoreDiff = scores[0] - (scores[1] + turnTotal);

        if (scores[0] <= 60) {
            // hold at 20
            if (turnTotal >= 20) {
                hold();
            } else {
                //roll
                delayRoll();
            }
        }
        else if (scores[0] <= 80) {
            if (scoreDiff <= 30) {
                // hold at 20
                if (turnTotal >= 20) {
                    hold();
                } else {
                    // roll
                    delayRoll();
                }
            }
            else {
                // hold at 30
                if (turnTotal >= 30) {
                    hold();
                } else {
                    // roll
                    delayRoll();
                }
            }
        }
        else if (scores[0] <= 90) {
            if (scoreDiff > 10) { // get within 10 pts of player score
                // roll
                delayRoll();
            } else if (turnTotal <= 20) { // if within 10 points or with advantage, play normally
                delayRoll();
            } else { // otherwise hold
                hold();
            }
        }
        else {
            // roll (never hold until game won)
            delayRoll();
        }
    }
    

    /* Wait function - executes the roll function provided after 3000 ms (so the game feels more authentic) */
    function delayRoll() {
        setTimeout(function() {
            roll();
            if (!gameWon) {
                gameTurns(); // keep playing until hold or roll 1
            }
        }, 1000);
    }
    
    
    /* Ends the game */
    function endGame() {
        // end game
        scores[turn%2] += turnTotal;
        turnTotal = 0;
        update();
        
        // remove all event handlers
        $roll.off();
        $hold.off();
        
        // add restart button
        $('<button id="restart">Restart</button>').on('click', function() {
            location.reload();
        }).appendTo('main');
        
        // generate content for modal window that display result of the game
        var $content, $quote, $img;
        if (turn%2 == 0) { // player won game
            $content = $('<div id=modal-content"><h2>You won!</h2></div>');
            $quote = $('<div>Here\'s a gift: <blockquote>"In a victory speech, I always like to thank the opposition, because without their help and stupidity, I couldn’t have won."</blockquote><span id="author">- Jarod Kintz</span></div>');
            $img = $('<img src="res/victory.gif" />');
        } else { // player lost
            $content = $('<div id=modal-content"><h2>You lost...</h2></div>');
            $quote = $('<div>Feel better: <blockquote>"Never confuse a single defeat with a final defeat."<blockquote><span id="author">- F. Scott Fitzgerald</span></div>');
            $img = $('<img src="res/defeat.gif" />');
        }
        $content.append($img).append($quote);
        
        // create modal window 
        createModal($content, true);
    }
});