$(document).ready(function() {
    $('.flyoutButton').click(function() {
        $('#rss, #image, #navigation').addClass('offscreen');
        $('#mainButton').click();
    });

    $('#homeButton img').click(function() {
        $('#rss, #image, #navigation').removeClass('offscreen');
    });
});
