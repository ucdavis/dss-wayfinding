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

  // Remove static side
  $(".vertical-nav, .navbar-header").remove();

  // Event handlers for search
  // This is duplicated from application.js because
  // The page loads application.js first then landing.js
  // This means the initial events for this is set on .navbar-header
  $("#search").on("keyup", function() {
    if ($("#search").val() != "") {
      $("#result").show();
    }
  });

  $("#search").on("focus", function() {
    if ($("#search").val() != "") {
      $("#result").show();
    }
  });

  $(document).mouseup(function(e) {
    var container = $("#result, #search");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      $("#result").hide();
    }
  });
});
