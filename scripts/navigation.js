$(document).ready(function() {
    $('.flyoutButton').click(function() {
        $.get($('input', this)[0].value, function(data) {
            $('#content').html(data);
            $('#rss, #image, #navigation').addClass('offscreen');
            $('#mainButton').click();
        })
    });

    $('#homeButton img').click(function() {
        $('#rss, #image, #navigation').removeClass('offscreen');
    });
});
