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
  addListeners();
  initialDraw();
}

function setPanZoom() {
  $("#svgImage").panzoom();
}

//adds touch based listeners and resizing listener
function addListeners(){
  document.getElementById('viewing').addEventListener('touchstart', touchStart);
  document.getElementById('viewing').addEventListener('touchmove', touchMove);
  document.getElementById('viewing').addEventListener('touchend', touchEnd);
  window.addEventListener('resize', resize);
}

//sets up origin floor for display, and replaces the loading gif with the canvas/svg
function initialDraw(){
  $("#mapLoading").remove();
  $('#floor'+currentFloor).css("display", "inline");
  // $("div.floor svg").attr({"width":c.width,"height":c.height});
  // $("div.floor svg").css({"width":c.width,"height":c.height});
  $("#flr-btn" + currentFloor).addClass("active").addClass("start");
  // ctx.clearRect(0,0,c.height,c.width);
  // ctx.drawImage(can[currentFloor],0,0,can[currentFloor].width,
                // can[currentFloor].height,0,0,c.width,c.height);
  $("#floor" + currentFloor).css("display","inline");
  //if destination was included in page call, run routing function
  setPanZoom();
  if (routeTrigger == true)
    $(document).trigger('show:roomClick', {room_id: destination});
}

//updates the viewbox of the current svg
function updateViewBox(){
  $("#floor" + currentFloor + " svg").attr("viewbox", function(){
    return ((shiftX*views[currentFloor][2]/can[currentFloor].width + views[currentFloor][0]) + " " +
           (shiftY*views[currentFloor][3]/can[currentFloor].height + views[currentFloor][1]) + " " +
           views[currentFloor][2]/currentZoom + " " + views[currentFloor][3]/currentZoom);
  });

}

//changes the svg displayed
function changeSVGFloor(newFloor){
  $("#floor" + currentFloor).css("display", "none");
  $("#floor" + newFloor).css("display", "inline");
  currentFloor = newFloor;
}

//attaches listeners
function begin(){
  $("svg").on('mousedown', function(event){
    down = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  $("body").on('mouseleave', function(event){
    down = false;
  });

  $("body, svg").on('mousemove', function(event){
    if (down){
      shiftX = shiftX - (event.clientX - mouseX) / currentZoom;
      shiftY = shiftY - (event.clientY - mouseY) / currentZoom;
      mouseX = event.clientX;
      mouseY = event.clientY;
      mouseMoved = true;
      if (shiftX < 0) shiftX = 0;
      else if (shiftX > shiftXMax) shiftX = shiftXMax;
      if (shiftY < 0) shiftY = 0;
      else if (shiftY > shiftYMax) shiftY = shiftYMax;
      ctx.clearRect(0,0,c.width,c.height);
      ctx.drawImage(can[currentFloor],shiftX,shiftY,can[currentFloor].width/currentZoom,
                    can[currentFloor].height/currentZoom,0,0,c.width,c.height);
      updateViewBox();
    }
  });

  $("body").on('mouseup', function(event){
    down = false;
    mouseMoved = false;
  });

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
        toggleInfoPanel('min');

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
    $("a.accessible").toggleClass('active');
    $('#svgImage').wayfinding('accessibleRoute', !$('#svgImage').wayfinding('accessibleRoute'),
                              function() {
      if($('.replay').hasClass("disabled") == false && !animating) {
        drawing = $('#svgImage').wayfinding('routeTo', destination);
        $('.replay').addClass('disabled');
        $("#svgImage").wayfinding('animatePath');
      }
    });
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
    changeSVGFloor(next);
    $("#flr-btn" + currentFloor).removeClass("active");
    currentFloor = next;
    $("#flr-btn" + currentFloor).addClass("active");
  });

  $(document).on('wayfinding:animationComplete', function(e, data) {
    toggleInfoPanel();
  });

  $('.replay').click(function(e) {
    e.preventDefault();
    if (drawing.length > 0 && !$(this).hasClass('disabled') && !animating) {
      $("#svgImage").wayfinding('animatePath');
      toggleInfoPanel('min');
    }
  });
}

function touchStart(event) {
  down = true;
  touches = event.touches;
  for(var i = 0; i < touches.length; i++){
    touchesRecord[i] = {
      identifier : touches[i].identifier,
      pageX : parseInt(touches[i].pageX),
      pageY : parseInt(touches[i].pageY)
    };
  }
}

function touchMove(event) {
  event.preventDefault();
  if (!animating){
    var touches = event.touches;
    var touch = [];
    touch[0] = {x: parseInt(touches[0].pageX), y: parseInt(touches[0].pageY)};
    if (event.touches.length == 1 && down == true){
      var shiftValue = (touch[0].x - touchesRecord[0].pageX) * (can[currentFloor].width / c.width);
      shiftX = shiftX - shiftValue / currentZoom;
      shiftValue = (touch[0].y - touchesRecord[0].pageY) * (can[currentFloor].height / c.height);
      shiftY = shiftY - shiftValue/currentZoom;
      touchesRecord[0].pageX = touch[0].x;
      touchesRecord[0].pageY = touch[0].y;
      mouseMoved = true;
      if (shiftX < 0) shiftX = 0;
      else if (shiftX > shiftXMax) shiftX = shiftXMax;
      if (shiftY < 0) shiftY = 0;
      else if (shiftY > shiftYMax) shiftY = shiftYMax;
      ctx.clearRect(0,0,c.width,c.height);
      ctx.drawImage(can[currentFloor],shiftX,shiftY,can[currentFloor].width/currentZoom,
                    can[currentFloor].height/currentZoom,0,0,c.width,c.height);
      updateViewBox();
    } else if (event.touches.length > 1 && down == true) {
      touch[1] = {x: parseInt(touches[1].pageX), y: parseInt(touches[1].pageY)};
      var dx1 = Math.abs(touch[0].x-touch[1].x);
      var dy1 = Math.abs(touch[0].y-touch[1].y);
      var dx0 = Math.abs(touchesRecord[0].pageX-touchesRecord[1].pageX);
      var dy0 = Math.abs(touchesRecord[0].pageY-touchesRecord[1].pageY);
      var currentShiftX = shiftX;
      var currentShiftY = shiftY;
      var DWidth = can[currentFloor].width;
      var DHeight = can[currentFloor].height;
      touchesRecord[0].pageX = touch[0].x;
      touchesRecord[1].pageX = touch[1].x;
      touchesRecord[0].pageY = touch[0].y;
      touchesRecord[1].pageY = touch[1].y;
      currentShiftX = Math.floor((2*currentShiftX+DWidth/currentZoom)/2);
      currentShiftY = Math.floor((2*currentShiftY+DHeight/currentZoom)/2);
      if (dx1 >= dx0 && dy1 >= dy0){
        var maxi;
        if (dx1 - dx0 > dy1 - dy0)
          maxi = (dx1-dx0)/200;
        else
          maxi = (dy1-dy0)/200;
          currentZoom = currentZoom + maxi;
        } else if (dx1 <= dx0 && dy1 <= dy0){
          var maxi;
          if (dx0 - dx1 > dy0 - dy1)
            maxi = (dx0-dx1)/200;
          else
            maxi = (dy0-dy1)/200;
          currentZoom = currentZoom - maxi;
        }
        if (currentZoom < 1)
          currentZoom = 1;
        else if (currentZoom > maxZoom)
          currentZoom = maxZoom;
        shiftX = currentShiftX - DWidth/currentZoom/2;
        shiftY = currentShiftY - DHeight/currentZoom/2;
        shiftXMax = Math.floor(can[currentFloor].width * (1 - 1/currentZoom));
        shiftYMax = Math.floor(can[currentFloor].height * (1 - 1/currentZoom));
        if (shiftX < 0) shiftX = 0;
        else if (shiftX > shiftXMax) shiftX = shiftXMax;
        if (shiftY < 0) shiftY = 0;
        else if (shiftY > shiftYMax) shiftY = shiftYMax;
        ctx.clearRect(0,0,c.width,c.height);
        ctx.drawImage(can[currentFloor], shiftX, shiftY, can[currentFloor].width/currentZoom, can[currentFloor].height/
                      currentZoom, 0, 0, c.width, c.height);
        updateViewBox();
      }
    }
  }

  //when finger is removed, update values
  function touchEnd(event) {
    if (event.touches.length == 0)
      down = false;
    else if (event.touches.length == 1){
      touchesRecord[0] = {
        identifier : event.touches[0].identifier,
        pageX : parseInt(event.touches[0].pageX),
        pageY : parseInt(event.touches[0].pageY)
      };
    }
  }

  //change canvas and svg dimensions when window size changes
  function resize(){
    c.width = parseInt($('#myCanvas').css('width'));
    $('#myCanvas').css('height', function(){
      return Math.floor(c.width*floors[currentFloor].height/floors[currentFloor].width);
    });
    c.height = parseInt($('#myCanvas').css('height'));
    $('svg').attr({'width':c.width,'height':c.height});
    $('svg').css({'width':c.width,'height':c.height});
    ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(can[currentFloor], shiftX, shiftY, can[currentFloor].width/currentZoom,
                  can[currentFloor].height/currentZoom, 0,0,c.width,c.height);
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
