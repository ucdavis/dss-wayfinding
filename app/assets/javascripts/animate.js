$(function() {
  // Ease-in the left nav only if the user is coming from the landing page
  if (document.referrer == window.location.origin + "/") {
    $('ul.vertical-nav').css('left','-200%');
    setTimeout(function(){
      $('ul.vertical-nav').animate({left: 0}, 500)
      }, 0);
  }
});
