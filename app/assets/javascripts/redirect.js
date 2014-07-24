function setRedirectToHome() {
  // Cancel any previous timer
  clearTimeout(document.timer);
  // Redirect after 3 minutes if @origin is set (Kiosk mode)
  document.timer = setTimeout(function(){
    if (document.origin != '') {
      $('ul.vertical-nav').animate({left: '-200%'}, 500, function() {
        setTimeout(function(){
          window.location = "/";
        }, 500);
      })
    }
  }, 180000);
}
