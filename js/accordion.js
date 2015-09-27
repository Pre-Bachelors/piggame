$(function() {
    $('.accordion').each(function() {
        // get page elements that are part of the accordion (the title and content)
        var $title = $(this).find('.title');
        var $content = $(this).find('.content');

        // add accordion to page
        $title.off().on('click', function() {
            // toggles the content (shows if hidden and hides if shown)
            $content.slideToggle();
            // chance title's class to indicate if contracted or not
            $title.toggleClass('contracted');
        });
    });
});