$(document).ready(function() {
    // When flyout button is clicked, hide start screen stuff
    $('.flyoutButton').click(function() {
        // $.get($('input', this)[0].value, function(data) {
            // $('#content').html(data);
            $('#rss, #image, #navigation').addClass('offscreen');
            $('#mainButton').click();
        // })
    });

    // On homebutton click, bring back the start screen
    $('#homeButton img').click(function() {
        $('#rss, #image, #navigation').removeClass('offscreen');
    });

    // RSS links should be unclickable
    $('#rss').on('click', 'a', function(e) {e.preventDefault();});
});
