//= require wayfinding.datastore
//= require jquery.wayfinding
//= require emscripten.pathfinding.js
//= require priority-queue.min.js
//= require redirect
//= require jquery.panzoom.js

var drawing;                //variable to hold route information
var destination;
var animating = false;      /* Use as a check if you want something to
NOT operate during animation (i.e. ignore room click if true)*/
var routeTrigger;           //if true, destination already exists so run the routing function on page load

/**
 * Escapes a string ** required for replaceAll **
 * http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
} // function escapeRegExp

/**
 * This function searches the piece given and replaces it with the second piece
 * @param {String} str - targetted string
 * @param {String} search - the piece we don't want
 * @param {String} replacement - the piece we want instead
 */
function replaceAll (str, search, replacement) {
    search = escapeRegExp(search);
    return str.replace(new RegExp(search, 'g'), replacement);
}; // function replaceAll


//functions to run once everything has loaded
function onLoad(){
  attachListeners();
  initialDraw();
}

function setPanZoom(target) {
  // Otherwise panzoom will remove click events
  $(target + " a").on('mousedown touchstart', function( e ) {
    e.stopImmediatePropagation();
  });

  $(target).panzoom({
    $zoomIn: $(".zoom-in"),
    $zoomOut: $(".zoom-out"),
    $reset: $(".zoom-reset"),
    panOnlyWhenZoomed: true,
    minScale: 1,
    maxScale: 5,
    increment: 0.5
  });
}

function destroyPanZoom(target) {
  $(target).panzoom("reset");
  $(target).panzoom("destroy");
}

//sets up origin floor for display, and replaces the loading gif with the canvas/svg
function initialDraw(){
  $("#flr-btn" + currentFloor).addClass("active").addClass("start");
  changeSVGFloor(currentFloor);

  //if destination was included in page call, run routing function
  if (routeTrigger == true)
    $(document).trigger('show:roomClick', {room_id: destination});
}

//changes the svg displayed
function changeSVGFloor(newFloor){
  $("#flr-btn" + currentFloor).removeClass("active");
  $("#floor" + currentFloor).css("display", "none");
  $("#floor" + newFloor).css("display", "inline");
  $("#flr-btn" + newFloor).addClass("active");

  destroyPanZoom("#floor" + currentFloor);
  setPanZoom('#floor'+newFloor);
  currentFloor = newFloor;
}

//attaches listeners
function attachListeners(){
  $("#Rooms a").click(function(event){
    event.preventDefault();
    if (!animating){
      destination = $(this).attr('id');
      $(document).trigger('show:roomClick', [ { room_id : $(this).attr('id') } ] );
    }
  });

  $(document).on('show:roomClick', function(e, data){
    console.debug("Clicked room: " + data.room_id);

    // Get the shortest path
    drawing = $("#viewing").wayfinding('routeTo', destination);

    // Reset the home page return timer
    setRedirectToHome();

    // If there's a valid path ...
    if (drawing.length > 0) {
      // ... still if there's a shortest path ...
      if (drawing[0].length > 0){
        // Ensure the info panel is minimized
        $.get({
          url: "/room/" + destination.substr(1) + ".json",
          async: false,
          success: function (data) {
            // TODO: showInfo is really "setInfo" as it doesn't show the panel
            showInfo(data);
          }
        });

        $("#viewing").wayfinding('animatePath');
      }
    }
  });

  $(".accessible").click(function(e) {
    e.preventDefault();
    setRedirectToHome();

    if (!animating) {
      $("a.accessible").toggleClass('active');
      $('#viewing').wayfinding('accessibleRoute', !$('#viewing').wayfinding('accessibleRoute'),
      function() {
        if($('.replay').hasClass("disabled") == false) {
          drawing = $('#viewing').wayfinding('routeTo', destination);
          $('.replay').addClass('disabled');
          $("#viewing").wayfinding('animatePath');
        }
      });
    }

  });

  $("a.btn-floor").click(function(event){
    event.preventDefault();
    if (!animating){
      console.log($(this).attr('id'));
      $(document).trigger('show:floorChange', [ { floor_id : $(this).attr('id') } ] );
    }
  });

  $(document).on('show:floorChange', function(e, data){
    var next = parseInt(data.floor_id.substr(7,7));
    $("#flr-btn" + currentFloor).removeClass("active");
    changeSVGFloor(next);
    currentFloor = next;
    $("#flr-btn" + currentFloor).addClass("active");
  });

  $(document).on('wayfinding:animationComplete', function(e, data) {
    toggleInfoPanel();
    animating = false;

    // Enable Replay
    $(".replay").removeClass("disabled");
  });

  $('.replay').click(function(e) {
    e.preventDefault();
    if (drawing.length > 0 && !$(this).hasClass('disabled') && !animating) {
      $("#viewing").wayfinding('animatePath');
      toggleInfoPanel('min');
    }
  });
} // function attachListeners

/**
 * Toggles information panel open or close unless specified otherwise
 * @param {String} state - 'min' for closed
 */
var toggleInfoPanel = function (state) {
  state = state || 'toggle';
  var width = $('#destination-view').outerWidth();

  if (state == 'min' || $('#destination-view').css('right') == '0px') {
    $('#destination-view').css('right', -width + 0);
    $('#destination-view-bg').css('right', -width + 0);
    $('#destination-view-bg').outerWidth(width);
    $('i.btn-min-max').removeClass('icon-right-arrow').addClass('icon-left-arrow');
  } else {
    $('#destination-view').css('right', 0);
    $('#destination-view-bg').css('right', 0);
    $('i.btn-min-max').removeClass('icon-left-arrow').addClass('icon-right-arrow');
  }
} // function toggleInfoPanel

/**
 * Populates information panel
 * @param {Object} data - data to populate the panel with
 */
var showInfo = function (data) {
  class_suffix = data.type || 'rooms'

  // Remove previous information
  $('#destination-view h2, #destination-view span').remove();
  $('#destination-view h1').addClass('btn-' + class_suffix);
  $('#destination-view i.btn-min-max').addClass('btn-' + class_suffix);
  $('#destination-view').addClass('text-' + class_suffix);

  if (data) {
    // Insert infomation in a fragment
    var dataFragment = document.createDocumentFragment();
    var dataHTML = "";
    dataHTML += '<div class="destination-info-container">';
    dataHTML += '<h2 class="destination-info-align-margin pull-left">Location:</h2>';
    dataHTML += '<span class="title-style pull-left">' + data.room_number + "</span>";

    if (data.people && data.people.length > 0) {
      dataHTML += '<h2 class="destination-info-align-margin">Occupants:</h2>';
      for (var i = 0; i < data.people.length; i++) {
        var person = data.people[i];
        person.office_hours = replaceAll(person.office_hours, '\n', '<br />');

        dataHTML += '<span class="title-style pull-left">' + person.name + "</span>";
        dataHTML += '<span class="destination-info-align-margin pull-left">' + person.email + "</span>";
        dataHTML += '<span class="destination-info-align-margin pull-left">' + person.phone + "</span>";
        dataHTML += '<span class="destination-info-align-margin pull-left">' + person.office_hours + "</span>";
      }
    }

    dataHTML += '</div>';
    $(dataFragment).append(dataHTML);
    // Inject fragment to DOM
    $("#destination-view").children().first().after(dataFragment);
    $('#destination-view').css('right', -9999);
    $('#destination-view-bg').css('right', -9999);
    toggleInfoPanel('min');
    $('#destination-view .min-max').on('click', toggleInfoPanel);

    handleLinksWithJS();
  } else {
    console.warn('Object not found in directory');
    $('#destination-view').css('right', '-1000px');
    $('#destination-view-bg').css('right', '-1000px');
  }
} // function showInfo
