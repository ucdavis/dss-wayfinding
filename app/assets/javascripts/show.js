//= require wayfinding.datastore
//= require jquery.wayfinding
//= require emscripten.pathfinding.js
//= require priority-queue.min.js
//= require redirect
//= require jquery.panzoom.js

var floors = [];            //stores img files for each floor
var c;                      //variable that points to #myCanvas
var ctx;                    //context for c
var touchesRecord = {};     //Stores last set of touch values
var currentFloor = 0;       //The current active floor
var nextFloor = 0;          //The floor to switch to when floor change occurs
var can = [];               //set of internal canvases that can be drawn to for each floor
var con = [];               //set of contexts for can variable

var down = false;           //limits user panning on pc to when mouse button is held down over the image area
var mouseX;                 //last recorded mouse x location during start/move events
var mouseY;                 //last recorded mouse y location during start/move events
var mouseMoved = false;     //whether mouse has moved since mouse button was pressed down (may no longer be used)
var shiftX = 0;             //distance to shift left side of viewbox
var shiftY = 0;             //distance to shift top of viewbox
var shiftXMax = 0;          //maximum distance to shift left side of viewbox at current zoom level
var shiftYMax = 0;          //maximum distance to shift top of viewbox at current zoom level
var drawing;                //variable to hold route information
var views = [];             /*holds initial viewbox information for each floor: views[floor#][x] where
                              0 <= x < 4, in order: minimum x, minimum y, width, height of SVG*/
var bases = [];             //holds x and y displacement values for each floor
var currentZoom = 1;        //current magnification level
var maxZoom = 3;            //maximum allowed magnification.
var destination;
var animating = false;      /*currently does not effect operation, use as a check if you want something to
                              NOT operate during animation (i.e. ignore room click if true)*/
var routeTrigger;           //if true, destination already exists so run the routing function on page load

//line constants
var animationSpeed = 20;    //time to wait between animation frames
var drawLength = 3;         //number of pixels to draw per frame when drawing a line
var lineWidth = 5;          //width of line to draw for routes
var lineColor = "#FF00FF";  //color of line to draw for routes

// svgPanZoom
var svgControl;

//once all data is loaded, set up internal canvases, contexts, default viewboxes.
function onLoad(){
  initialDraw();
}

function setPanZoom() {
  svgControl = $("#svgImage");
  $("#svgImage a").on('mousedown touchstart', function( e ) {
    e.stopImmediatePropagation();
  });
  svgControl.panzoom({
    $zoomIn: $(".zoom-in"),
    $zoomOut: $(".zoom-out"),
    $reset: $(".zoom-reset"),
    panOnlyWhenZoomed: true,
    minScale: 1,
    maxScale: 5
  });
}

//sets up origin floor for display, and replaces the loading gif with the canvas/svg
function initialDraw(){
  $("#mapLoading").remove();
  $('#floor'+currentFloor).css("display", "inline");
  $("#flr-btn" + currentFloor).addClass("active").addClass("start");
  $("#floor" + currentFloor).css("display","inline");
  setPanZoom();
  //if destination was included in page call, run routing function
  if (routeTrigger == true)
    $(document).trigger('show:roomClick', {room_id: destination});
}

//changes the svg displayed
function changeSVGFloor(newFloor){
  $("#floor" + currentFloor).css("display", "none");
  $("#floor" + newFloor).css("display", "inline");
  currentFloor = newFloor;
}

//attaches listeners
function begin(){
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
    drawing = $("#svgImage").wayfinding('routeTo', destination);

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

        $("#svgImage").wayfinding('animatePath');
      }
    }
  });

  $(".accessible").click(function(e) {
    e.preventDefault();
    setRedirectToHome();

    if (!animating) {
      $("a.accessible").toggleClass('active');
      $('#svgImage').wayfinding('accessibleRoute', !$('#svgImage').wayfinding('accessibleRoute'),
                                function() {
        if($('.replay').hasClass("disabled") == false) {
          drawing = $('#svgImage').wayfinding('routeTo', destination);
          $('.replay').addClass('disabled');
          $("#svgImage").wayfinding('animatePath');
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
      $("#svgImage").wayfinding('animatePath');
      toggleInfoPanel('min');
    }
  });
}

  //add hooks to allow setting svg preserveAspectRatio and viewbox parameters
  $.attrHooks['viewbox'] = {
    get: function(elem) {
      return elem.getAttribute("viewBox");
    },
    set: function(elem, value){
      elem.setAttribute("viewBox", value);
      return true;
    },
  };

  $.attrHooks['preserveAspectRatio'] = {
    get: function(elem) {
      return elem.getAttribute("preserveAspectRatio");
    },
    set: function(elem, value){
      elem.setAttribute("preserveAspectRatio", value);
      return true;
    },
  };

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
  }

  var showInfo = function (data) {
    class_suffix = data.type || 'rooms'

    $('#destination-view h2, #destination-view span').remove();
    $('#destination-view h1').addClass('btn-' + class_suffix);
    $('#destination-view i.btn-min-max').addClass('btn-' + class_suffix);
    $('#destination-view').addClass('text-' + class_suffix);

    var attrs = ['name', 'room_number', 'email', 'phone'];

    if (data) {
      for (var i = 0; i < attrs.length; i++) {
        value = eval("data." + attrs[i]);
        if (value) {
          $('#destination-view').append("<h2>" + attrs[i].split('_').join(' ') + "</h2>");
          $('#destination-view').append("<span>" + value + "</span>");
        }
      }

      if (data.department) {
        $('#destination-view').append("<h2>Search Similar</h2><a href='/search?q=" + data.department + "'><span class='label label-default btn-departments'>" + data.department + "</span></a>");
      }

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
  }
