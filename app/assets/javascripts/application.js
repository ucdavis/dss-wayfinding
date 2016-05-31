//= require jquery
//= require jquery_ujs
//= require bootstrap
//= require underscore

var handleLinksWithJS = function () {
  // Handle left nav links using javascript (fixes guided mode issue on iPad)
  var a=$('a[href]:not([href^="\\#"])');

  for(var i=0;i<a.length;i++)
  {
    a[i].onclick=function()
    {
      window.location=this.getAttribute("href");
      return false;
    }
  }
}

$(function() {
  handleLinksWithJS();
  document.csrf = $('meta[name="csrf-token"]')[0].content;
});

// Add compatibility classes to required elements if user agent is determined to be mobile safari
$(document).ready(function() {
  if ( (navigator.userAgent.match(/(iPod|iPhone)/) != null) && (navigator.userAgent.match(/AppleWebKit/) != null) ) {
    $("#accessibility-nav").addClass("safari-mobile-compatibility");
    $("body").addClass("safari-mobile-compatibility");
    $("#map").addClass("safari-mobile-compatibility");
    $(".landing-ul").addClass("safari-mobile-compatibility");
  }
});
