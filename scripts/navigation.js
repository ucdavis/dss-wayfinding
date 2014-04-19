$(document).ready(function() {
    // When nav button is clicked, dock nav buttons and highlight selected
    $('#navigation a').click(function() {
        $('#header').fadeOut(200);
        $('#navigation').find('*').addBack()
        .removeClass('selected')
        .addClass('docked');
        $(this).addClass('selected');
        $('#content').addClass('displayed')
    });
});
