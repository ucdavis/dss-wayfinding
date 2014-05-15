$(document).ready(function() {
    // When nav button is clicked, dock nav buttons and highlight selected
    $('#navigation a').click(function() {
        $('#navigation').find('*').addBack()
        .removeClass('selected');
        $(this).addClass('selected');
        $('#content').addClass('displayed')
    });

    $('.secondaryNav').on('click', '#dropdown-button', function() {
        $('.secondaryNav select').click();
    });
});
