function resizeIcons() {
  var iconSize = Math.min(window.innerHeight/6-40, 0.1*window.innerWidth);
  $('.vertical-nav li a')
    .css('height', iconSize + 'px')
    .css('width', iconSize + 'px')
    .css('line-height', 0.8*iconSize + 'px')
    .css('font-size', iconSize/2 + 'px')
    .css('border-width', 0.08*iconSize + 'px');
}

$(function() {
  // Ease-in the left nav only if the user is coming from the landing page
  if (document.referrer == window.location.origin + "/") {
    $('ul.vertical-nav').css('left','-200%');
    setTimeout(function(){
      $('ul.vertical-nav').animate({left: 0}, 500)
      }, 0);
  }

  $( window ).resize(function() {
    resizeIcons();
  });
});
