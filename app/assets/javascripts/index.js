//= require redirect

var ready;
ready = function() {
  $(".clickable-row").click(function() {
    window.document.location = $(this).data("url");
  });

  // Identify coordinates for scrubber categories
  var scrubber_categories = $('#slider-vertical li');
  var scrubber_breakpoints = [];
  var previous_active_category = "";

  for(i = 0; i < scrubber_categories.length; i++) {
      rect = scrubber_categories[i].getBoundingClientRect();
      scrubber_breakpoints[i] = rect.bottom;
  }

  // Watches for touch on sidebar scrubber, applies the 'active' class and triggers anchors in response
  $('#slider-vertical').on("touchmove", function(e){
    e.preventDefault();

    touch = event.touches.item(0);
    fingerX = touch.clientX;
    fingerY = touch.clientY;

    active_category = "";

    // Identify which scrubber category the finger is on
    for(i = 0; i < scrubber_breakpoints.length; i++) {
      if(fingerY < scrubber_breakpoints[i]) {
        active_category = i;
        i = 100;
      }
    }

    // Touch is below the last scrubber_category, so use the last category
    if(active_category === "") {
      active_category = (scrubber_breakpoints.length - 1);
    }

    // Are we on a new category? If so apply styling
    if ( active_category != previous_active_category ) {

      active_element = $("#scrubber-category_" + active_category);
      active_element.addClass("active");

      inactive_element = $('#scrubber-category_' + previous_active_category);
      inactive_element.removeClass("active");

      // Remove any potential hovering triggered during the movement
      $("[id^=scrubber-category]").blur();
      $("[id^=scrubber-category]").children().blur();

      previous_active_category = active_category;
    }

    // Trigger anchors
    active_element.children()[0].click();
  });

  $('#slider-vertical').on("touchend", function(e){
    scrubElement = "";
  });

  $('#slider-vertical').on("touchstart", function(e){
    $("[id^=scrubber-category]").removeClass("active");
  });
};

$(document).ready(ready);
$(document).on('page:load', ready);
