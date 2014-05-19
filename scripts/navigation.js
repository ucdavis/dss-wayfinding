$(document).ready(function() {
    // When nav button is clicked, dock nav buttons and highlight selected
    $('#navigation a').click(function() {
        $('#navigation').find('*').addBack()
        .removeClass('selected');
        $(this).parent().addClass('selected');
        $('#content').addClass('displayed')
    });
});
