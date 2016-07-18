//= require wayfinding.datastore
//= require jquery.wayfinding
//= require emscripten.pathfinding.js
//= require priority-queue.min.js
//= require redirect

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

//once all data is loaded, set up internal canvases, contexts, default viewboxes.
function onLoad(){

  addListeners();
  initialDraw();
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
  if (routeTrigger == true)
    $(document).trigger('show:roomClick', {room_id: destination});
}

// Collection of all route drawing functions
function drawRoute() {
  var changeFloorPause = 1000;        //time to wait before changing floors during a route
  var startFloorPause = 1500;         //time to wait before continuing to draw after floor change
  var currentX;                       //current x coordinate of draw path
  var currentY;                       //current y coordinate of draw path
  var currentSet;                     //index of current floor path in route (if a floor is revisited
                                      //during a route, it will have multiple indices here, it changes whenever floor changes
  var currentEntry;                   //current move/lineto/curveto command in the current set of the route
  var xDist;                          //horizontal distance between start and end of next entry
  var yDist;                          //vertical distance between start and end of next entry
  var len;		                        //Used to calculate the distance each frame should extend line, then used to store
                                      //remaining number of frames for that line
  var xControl;                       //x coordinate of control point
  var yControl;                       //y coordinate of control point
  var curvePoint;                     //control variable to calculate end position of next line in curve
  var curveIteration;                 //amount to adjust curvePoint each frame
  var unit;                           //distance each frame should extend the line
  var xMin;                           //minimum recorded x-value for that set, later adjusted for different floor dimensions
  var xMax;                           //maximum recorded x-value for that set, later adjusted for different floor dimensions
  var yMin;                           //minimum recorded y-value for that set, later adjusted for different floor dimensions
  var yMax;                           //maximum recorded y-value for that set, later adjusted for different floor dimensions
  var xWidth;                         //distance between xmin and xmax, later adjusted for different floor dimensions and to fit boundaries
  var yHeight;                        //distance between ymin and ymax, later adjusted for different floor dimensions and to fit boundaries
  var xUnitShift;                     //Distance to shift viewbox horizontally each frame
  var yUnitShift;                     //Distance to shift viewbox vertically each frame
  var widthUnitShift;                 //amount to change magnification level each frame
  var shiftUnitsRemaining;            //number of frames left for zoom operation
  var zoomIterations = 35;            //number of frames over which to change viewbox
  var routeComplete = false;

  beginRoute();

  //sets up starting values for each route, changes classes as necessary
  function beginRoute() {
    currentSet = 0
    currentEntry = 0;
    animating = true;
    routeComplete = false;
    $(".replay").addClass("disabled");
    $("a.btn-floor").removeClass("destination");
    $("#flr-btn" + drawing[drawing.length - 1][0].floor).addClass("destination");
    //restores internal canvases to default floor images
    for (var i = 0; i < 6; i++){
      con[i].clearRect(0,0,can[i].width,can[i].height);
      con[i].drawImage(floors[i], 0, 0, floors[i].width, floors[i].height, 0, 0, floors[i].width,
                       floors[i].height);
    }

    //starts at full size on floor change
    if (parseInt(drawing[0][0].floor) != currentFloor){
      shiftX = 0;
      shiftY = 0;
      currentZoom = 1;
      nextFloor = parseInt(drawing[0][0].floor);
      changeSVGFloor(nextFloor);
      currentFloor = nextFloor;
    }

    //changes floors if necessary
    //sets up the canvas for line drawing
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;

    //change active floor icon
    $("a.btn-floor").removeClass("active");
    $("#flr-btn" + currentFloor).addClass("active");
    //clear canvas and draw floor
    ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(can[currentFloor], shiftX,shiftY,can[currentFloor].width/currentZoom, can[currentFloor].height/currentZoom, 0, 0, c.width,c.height);
    //calculate and set starting point drawing
    currentX = parseFloat(drawing[0][0].x - views[currentFloor][0])
                          *floors[currentFloor].width/views[currentFloor][2] + bases[currentFloor].x;
    currentY = parseFloat(drawing[0][0].y - views[currentFloor][1])
                          *floors[currentFloor].height/views[currentFloor][3] + bases[currentFloor].y;
    con[currentFloor].beginPath();
    con[currentFloor].moveTo(currentX, currentY);
    if (drawing[currentSet].length > 2 || drawing.length > 2)
            window.requestAnimationFrame(changeFocus);
  }

  //sets up values for panning/zooming to the route
  function changeFocus(){
    var targetZoom;
    var midPoint;
    xMin = floors[currentFloor].width;
    xMax = views[currentFloor][0];
    yMin = floors[currentFloor].height;
    yMax = views[currentFloor][1];
    //finds minimum and maximum x and y values for the current drawing set
    for (var i = 0; i < drawing[currentSet].length; i++){
      drawing[currentSet][i].x = parseFloat(drawing[currentSet][i].x);
      drawing[currentSet][i].y = parseFloat(drawing[currentSet][i].y);
      if (drawing[currentSet][i].x < xMin)
        xMin = drawing[currentSet][i].x;
      if (drawing[currentSet][i].x > xMax)
        xMax = drawing[currentSet][i].x
      if (drawing[currentSet][i].y < yMin)
        yMin = drawing[currentSet][i].y;
      if (drawing[currentSet][i].y > yMax)
        yMax = drawing[currentSet][i].y
    }
    //converts the minimum and maximum values to the floors dimensions
    xMin = (xMin - views[currentFloor][0]) * floors[currentFloor].width / views[currentFloor][2];
    yMin = (yMin - views[currentFloor][1]) * floors[currentFloor].height / views[currentFloor][3];
    xMax = (xMax - views[currentFloor][0]) * floors[currentFloor].width / views[currentFloor][2];
    yMax = (yMax - views[currentFloor][1]) * floors[currentFloor].height / views[currentFloor][3];
    //adds 30% to width and height so route fits cleanly, then adjusts to ensure values remain within canvas
    midPoint = {x: (xMin + xMax)/2, y: (yMin + yMax)/2};
    xWidth = (xMax - xMin) * 1.5;
    yHeight = (yMax - yMin) * 1.5;
    if (yHeight > xWidth * can[currentFloor].height/can[currentFloor].width)
      xWidth = yHeight * can[currentFloor].width/can[currentFloor].height;
    if (xWidth < can[currentFloor].width/maxZoom){
      xWidth = can[currentFloor].width/maxZoom;
      yHeight = xWidth * can[currentFloor].height/can[currentFloor].width;
    } else if (xWidth > can[currentFloor].width){
      xWidth = can[currentFloor].width;
      yHeight = xWidth * can[currentFloor].height/can[currentFloor].width;
    }

    if (midPoint.x - xWidth/2 < 0)
      xMin = 0;
    else if (midPoint.x + xWidth/2 > can[currentFloor].width)
      xMin = can[currentFloor].width - xWidth;
    else
      xMin = midPoint.x - xWidth/2;

    if (midPoint.y - yHeight/2 < 0)
      yMin = 0;
    else if (midPoint.y + yHeight/2 > can[currentFloor].height)
      yMin = can[currentFloor].height - yHeight;
    else
      yMin = midPoint.y - yHeight/2;
    targetZoom = floors[currentFloor].width / xWidth;

    //calculate amount to shift each frame
    xUnitShift = (xMin-shiftX)/zoomIterations;
    yUnitShift = (yMin-shiftY)/zoomIterations;
    widthUnitShift = (targetZoom - currentZoom)/zoomIterations;
    shiftUnitsRemaining = zoomIterations;

    window.requestAnimationFrame(routeZoom);
  }

  function routeZoom(){
    //adjusts view values as calculates in changeFocus, draws the updated position.
    //Repeats for zoomIterations frames then calls route
    shiftX = shiftX + xUnitShift;
    shiftY = shiftY + yUnitShift;
    currentZoom = currentZoom + widthUnitShift;
    shiftUnitsRemaining = shiftUnitsRemaining - 1;
    if (shiftX < 0)
      shiftX = 0;
    if (shiftY < 0)
      shiftY = 0;
    if (currentZoom < 1)
      currentZoom = 1;
    ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(can[currentFloor], shiftX, shiftY, can[currentFloor].width/currentZoom,
                  can[currentFloor].height/currentZoom, 0,0,c.width,c.height);
    updateViewBox();
    if (shiftUnitsRemaining > 0)
      window.setTimeout(routeZoom, animationSpeed);
    else if (!routeComplete){
      ctx.beginPath();
      ctx.moveTo((currentX - shiftX) * c.width * currentZoom /floors[currentFloor].width, (currentY - shiftY) * c.height * currentZoom /floors[currentFloor].height);
      window.requestAnimationFrame(route);
    } else {
      $(".replay").removeClass("disabled");
      toggleInfoPanel();
      animating = false;
      shiftX = 0;
      shiftY = 0;
      currentZoom = 1;
      shiftXMax = 0;
      shiftYMax = 0;
      return;
    }
  }

  //adjusts drawing set/entry, and then makes calulations/calls functions according
  //to what type the current entry in drawing is.
  function route(){
    shiftXMax = Math.floor(can[currentFloor].width * (1 - 1/currentZoom));
    shiftYMax = Math.floor(can[currentFloor].height * (1 - 1/currentZoom));

    if (currentEntry < drawing[currentSet].length - 1) {
      currentEntry = currentEntry + 1;
      switchOver();
    } else if (currentSet < drawing.length - 1){
      currentSet++;
      currentEntry = 0;
      nextFloor = drawing[currentSet][currentFloor].floor;
      window.setTimeout(routeFloor, changeFloorPause);
    } else {
      routeComplete = true;
      xUnitShift = (0-shiftX)/zoomIterations;
      yUnitShift = (0-shiftY)/zoomIterations;
      widthUnitShift = (1 - currentZoom)/zoomIterations;
      shiftUnitsRemaining = zoomIterations;
      window.setTimeout(routeZoom, changeFloorPause);
    }
  }

  // Determine whether we need to draw a line or a B-curve
  function switchOver() {
    switch (drawing[currentSet][currentEntry].type){
      case "L":
            xDist = (parseFloat(drawing[currentSet][currentEntry].x) - views[currentFloor][0])
                    * floors[currentFloor].width/views[currentFloor][2] - currentX
                    + bases[currentFloor].x;
            yDist = (parseFloat(drawing[currentSet][currentEntry].y) - views[currentFloor][1])
                    * floors[currentFloor].height/views[currentFloor][3] - currentY
                    + bases[currentFloor].y;
            len = Math.sqrt(xDist*xDist + yDist*yDist);
            unit = drawLength / len;
            len = Math.ceil(len / drawLength);

            window.requestAnimationFrame(drawLine);

            break;
      case "Q":
            xMax = (parseFloat(drawing[currentSet][currentEntry].x) - views[currentFloor][0])
                    * floors[currentFloor].width/views[currentFloor][2] + bases[currentFloor].x;
            yMax = (parseFloat(drawing[currentSet][currentEntry].y) - views[currentFloor][1])
                    * floors[currentFloor].height/views[currentFloor][3] + bases[currentFloor].y;
            xControl = (parseFloat(drawing[currentSet][currentEntry].cx) - views[currentFloor][0])
                    * floors[currentFloor].width/views[currentFloor][2] + bases[currentFloor].x;
            yControl = (parseFloat(drawing[currentSet][currentEntry].cy) - views[currentFloor][1])
                    * floors[currentFloor].height/views[currentFloor][3] + bases[currentFloor].y;
            minX = currentX;
            minY = currentY;
            xDist = xMax - minX;
            yDist = yMax - minY;
            len = Math.sqrt(xDist * xDist + yDist * yDist);
            curvePoint = 0;
            curveIteration = drawLength / Math.ceil(len);

            window.requestAnimationFrame(drawQuad);

            break;
      default:
            return;
    }
  }

  //changes floor displayed by canvas and svg
  function routeFloor() {
    $("#flr-btn" + currentFloor).removeClass("active");
    changeSVGFloor(nextFloor);
    currentFloor = nextFloor;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    $("#flr-btn" + currentFloor).addClass("active");
    currentX = (parseFloat(drawing[currentSet][currentEntry].x) - views[currentFloor][0])
                 *floors[currentFloor].width/views[currentFloor][2];
    currentY = (parseFloat(drawing[currentSet][currentEntry].y) - views[currentFloor][1])
                 *floors[currentFloor].height/views[currentFloor][3];
    ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(can[currentFloor], 0,0,can[currentFloor].width,
                  can[currentFloor].height,0,0,c.width,c.height);
    shiftX = 0;
    shiftY = 0;
    currentZoom = 1;
    con[currentFloor].beginPath();
    con[currentFloor].moveTo(currentX,currentY);
    ctx.beginPath();
    ctx.moveTo(currentX * c.width/floors[currentFloor].width, currentY * c.height / floors[currentFloor].height);
    window.setTimeout(changeFocus, startFloorPause);
  }

  //draws the line segment to the internal canvas and myCanvas
  function drawLine(){
    var nextX = currentX + unit * xDist;
    var nextY = currentY + unit * yDist;

    con[currentFloor].lineTo(nextX, nextY);
    con[currentFloor].stroke();

    ctx.lineTo((nextX - shiftX) * c.width * currentZoom / floors[currentFloor].width, (nextY - shiftY) * c.height * currentZoom /floors[currentFloor].height);
    ctx.stroke();

    currentX = nextX;
    currentY = nextY;

    len = len-1;

    if (len > 0) {
      setTimeout(drawLine, animationSpeed);
    } else {
      requestAnimationFrame(route);
    }
  }

  //draws curve to internal canvas and myCanvas
  function drawQuad(){
    var nextX = (1-curvePoint)*(1-curvePoint)*(minX) + 2 * curvePoint * (1-curvePoint) * xControl + curvePoint * curvePoint * xMax;
    var nextY = (1-curvePoint)*(1-curvePoint)*(minY) + 2 * curvePoint * (1-curvePoint) * yControl + curvePoint * curvePoint * yMax;
    con[currentFloor].lineTo(nextX, nextY);
    con[currentFloor].stroke();
    ctx.lineTo((nextX - shiftX) * c.width * currentZoom /floors[currentFloor].width, (nextY - shiftY) * c.height * currentZoom /floors[currentFloor].height);
    ctx.stroke();
    currentX = nextX;
    currentY = nextY;
    if (curvePoint < 1){
      if (curvePoint + curveIteration < 1)
        curvePoint = curvePoint + curveIteration;
      else
        curvePoint = 1;
      setTimeout(drawQuad, animationSpeed);
    }
    else
      requestAnimationFrame(route);
  }
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
  // $("#floor" + newFloor + " svg").attr("viewbox", function(){
  //   return (views[newFloor][0] + " " + views[newFloor][1] + "  " +
  //           views[newFloor][2] + " " + views[newFloor][3]);
  // });
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

        // Get details of the room
        $.get( "/room/" + destination.substr(1) + ".json", function( data ) {
          // TODO: showInfo is really "setInfo" as it doesn't show the panel
          showInfo(data);
        });

        drawRoute();
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
        drawRoute();
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
    shiftX = 0;
    shiftY = 0;
    currentZoom = 1;
    shiftXMax = 0;
    shiftYMax = 0;
    c.height = c.width *floors[currentFloor].height/floors[currentFloor].width;
    $("#floor" + currentFloor + " svg").attr({"height":c.height,"width":c.width});
    $("#floor" + currentFloor + " svg").css({"height":c.height,"width":c.width});
    $("#myCanvas").css("height",c.height);
    ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(can[currentFloor],shiftX,shiftY,floors[currentFloor].width/currentZoom,
                  floors[currentFloor].height/currentZoom,0,0,c.width,c.height);
  });

  $('.replay').click(function(e) {
    e.preventDefault();
    if (drawing.length > 0 && !$(this).hasClass('disabled') && !animating) {
      drawRoute();
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
      $('#destination-view').css('right', -width + 20);
      $('#destination-view-bg').css('right', -width + 20);
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
