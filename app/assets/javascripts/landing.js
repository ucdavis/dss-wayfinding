$(function() {
  // When clicking any link in the landing page, animate, then go
  $('a').click(function(e) {
    var anchor = $(this), h;

    h = anchor.attr('href');
    e.preventDefault();

    $('ul.landing').animate({'margin-top': '200%'}, 700, function() {
      window.location = h;
    })
  });

  // Hide the buttons, then ease them in on page load
  $('ul.landing').css('top', '200%');
  $('ul.landing').animate({'top': '50%'}, 700)
});
