// setRedirectToHome is called whenever the redirection needs to be started
// or reset. This currently happens on page load (in production) and whenever
// a room is clicked (allowing more time for active users of the map).
function setRedirectToHome() {
  if(document.development_mode == true) return;

  // Cancel any previous timer
  clearTimeout(document.redirectTimer);

  // Redirect after 2 minutes if @origin is set (Kiosk mode)
  document.redirectTimer = setTimeout(function(){
    if (document.origin != '') {
      $('ul.vertical-nav').animate({left: '-200%'}, 500, function() {
        setTimeout(function(){
          window.location = "/";
        }, 500);
      })
    }
  }, 120000); // 2 minutes
}

$(function() {
  // Call redirect timer function
  setRedirectToHome();

  $('a.btn-home').click(function(e) {
    e.preventDefault();

    var anchor = $(this), h;
    h = anchor.attr('href');

    // Slide away the vertical navigation if it exists, but always redirect.
    if($('ul.vertical-nav').length == 0) {
      window.location = h;
    } else {
      $('ul.vertical-nav').animate({left: '-200%'}, 500, function() {
        window.location = h;
      });
    }
  });
});
