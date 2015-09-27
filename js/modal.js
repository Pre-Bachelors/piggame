/* 
 * Creates a Modal window indicating the result of the Game 
 * Takes two paremeters: 
 * 1 - (jQuery Object), that indicates the modal window's content
 * 2 - (boolean), that indicates whether the restart button should be shown (true) or hidden (false)
 */
function createModal($content, bool) {
    // create modal container, button container and buttons
    $container = $('<div id="modal" />');
    $buttons = $('<div id="buttons" />');
    var $buttonsAlign = $('<div id="button-align" />');
    var $restart = $('<button class="modal-button" id="modal-restart">Restart</button>');
    var $close = $('<button class="modal-button" id="modal-close">Go Back</button>');
    
    // add buttons to their container
    if (bool) {
        $buttonsAlign.append($restart);
    }   
    $buttonsAlign.append($close);
    $buttons.append($buttonsAlign);
    
    // store window in jQuery object
    $window = $(window);
        
    // dim the page, based on Sarfraz's example at 
    // http://stackoverflow.com/questions/9455556/how-can-i-dim-the-rest-of-the-web-page-when-displaying-a-notification-div
    $('<div id="dimmer">').css({
        width : "100%",
        height : "100%",
        background : "rgba(0, 0, 0, 0.8)",
        position : "fixed",
        top : "0",
        left : "0",
        zIndex : "10"
    }).appendTo(document.body);
    
    // add modal window to page
    $container.append($content);
    $container.css({
        width: 'auto',
        height: 'auto',
        position : "absolute",
        zIndex : 9999
    }).fadeIn(700).appendTo(document.body);
    // add buttons after (and not in) modal window
    $buttons.css({
        width: $container.innerWidth(),
        height: 'auto',
        position : "absolute",
        zIndex : 9999
    }).appendTo(document.body);
    
    // center
    centerModal(false);
    
    // because modal window's height can differ not only when windows is rezised,
    // which would cause the buttons to stay off place, centerModal is called every second
    var timeout = setInterval(function() {centerModal(true)}, 50);
    
    
    // add event listeners
    $restart.on('click', function() {
        // reload page
        location.reload(); 
    });
    $close.on('click', function() {
        $('#dimmer').remove(); // close dimmer
        $container.empty().remove(); // close modal window
        $buttons.empty().remove(); // remove btns
        clearInterval(timeout); // cancel timeout
    });
    $window.on('resize', centerModal());
}

/* Centers modal window (and buttons) in page - adapted from the book JavaScript & jQuery, Jon Duckett 
 * Parameter: a boolean indicating wheter the centering should be animated
 */
function centerModal(animate) {
    var top = Math.max($window.height() - $container.outerHeight(), 0) / 2;
    var left = Math.max($window.width() - $container.outerWidth(), 0) / 2;
    if (animate) {
        $container.animate({
            top: Math.floor(top + $window.scrollTop()),
            left: Math.floor(left + $window.scrollLeft()),
        }, 3);
        $buttons.animate({
            top: Math.floor(top + $window.scrollTop() + $container.outerHeight()),
            left: Math.floor(left + $window.scrollLeft()),
        }, 3);
    } else {
        $container.css({
            top: top + $window.scrollTop(),
            left: left + $window.scrollLeft(),
        });
        $buttons.css({
            top: top + $window.scrollTop() + $container.outerHeight(),
            left: left + $window.scrollLeft(),
        });
    }
}