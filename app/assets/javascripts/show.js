//= require wayfinding.datastore
//= require jquery.wayfinding
//= require redirect
var maps = [];
var floors = [];
var c;
var ctx;
var touchesRecord = {};
var currentFloor = 0;
var nextFloor = 0;
var can = [];
var con = [];
var animationSpeed = 20;
var drawLength = 3;
var lineWidth = 5;
var lineColor = "#FF0000";
var down = false;
var mouseX;
var mouseY;
var mouseMoved = false;
var shiftX = 0;
var shiftY = 0;
var shiftXMax = 0;
var shiftYMax = 0;
var drawing;
var views = [];
var bases = [];
var currentZoom = 1;
var destination;
var animating = false;
var routeTrigger;
var loadComplete = false;

function onLoad(){
  for (var i = 0; i < 6; i = i+1){
  can[i] = document.createElement('canvas');
  can[i].width = floors[i].width;
  can[i].height = floors[i].height;
  con[i] = can[i].getContext('2d');
  con[i].lineWidth = lineWidth;
  con[i].strokeStyle = lineColor;
  con[i].drawImage(floors[i], 0, 0, floors[i].width, floors[i].height, 0, 0, floors[i].width, 	
                   floors[i].height);
  bases[i] = {x: $("#floor" + i + " svg").attr("x"),y:$("#floor" + i + " svg").attr("y")};
  bases[i].x = parseFloat(bases[i].x);
  bases[i].y = parseFloat(bases[i].y);
  views[i] = $("#floor" + i + " svg").attr("viewbox").split(" ");
  for (var j = 0; j < 4; j++)
    views[i][j] = parseFloat(views[i][j]);
  }
  draw = document.createElement('canvas');
  drawCtx = draw.getContext("2d");
  drawCtx.lineWidth = lineWidth;
  drawCtx.strokeStyle = lineColor;
  c = document.getElementById("myCanvas");
  ctx = c.getContext("2d");
  c.width = parseInt($('#myCanvas').css('width'));
  $('#myCanvas').css('height', function(){
    return c.width * floors[currentFloor].height/floors[currentFloor].width;
  });
  c.height = parseInt($('#myCanvas').css('height'));
  addListeners();
  initialDraw();
}

function addListeners(){
  document.getElementById('viewing').addEventListener('touchstart', touchStart);
  document.getElementById('viewing').addEventListener('touchmove', touchMove);
  document.getElementById('viewing').addEventListener('touchend', touchEnd);
  window.addEventListener('resize', resize);
}

function initialDraw(){
  $("#mapLoading").remove();
  $('#'+maps[currentFloor]).css("display", "inline");
  $("div.floor svg").attr({"width":c.width,"height":c.height});
  $("#flr-btn" + currentFloor).addClass("active").addClass("start");
  ctx.clearRect(0,0,c.height,c.width);
  ctx.drawImage(can[currentFloor],0,0,can[currentFloor].width,
                can[currentFloor].height,0,0,c.width,c.height);
  if (routeTrigger == true)
    $(document).trigger('show:roomClick', {room_id: destination});
}
function routingFunctions(){
  var changeFloorPause = 1000;
  var startFloorPause = 1500;
  var currentX;
  var currentY;
  var currentSet;
  var currentEntry;
  var xDist;
  var yDist;
  var len;		
  var unit;
  var xMin;
  var xMax;
  var yMin;
  var yMax;
  var xWidth;
  var yHeight;
  var xUnitShift;
  var yUnitShift;
  var widthUnitShift;
  var shiftUnitsRemaining;
  var zoomIterations = 35;
  beginRoute();

  function beginRoute(){
    currentSet = 0
    currentEntry = 0;
    animating = true;
    console.log(drawing);
    $(".replay").addClass("disabled");
    $("a.btn-floor").removeClass("destination");
    $("#flr-btn" + drawing[drawing.length - 1][0].floor).addClass("destination");
    for (var i = 0; i < 6; i++){
      con[i].clearRect(0,0,can[i].width,can[i].height);
      con[i].drawImage(floors[i], 0, 0, floors[i].width, floors[i].height, 0, 0, floors[i].width, 	
                       floors[i].height);
    }
    if (parseInt(drawing[0][0].floor) != currentFloor){
      shiftX = 0;
      shiftY = 0;
      currentZoom = 1;
    }
    nextFloor = parseInt(drawing[0][0].floor);
    changeSVGFloor(nextFloor);
    currentFloor = nextFloor;
    draw.width = floors[currentFloor].width;
    draw.height = floors[currentFloor].height;
    drawCtx.lineWidth = lineWidth;
    drawCtx.strokeStyle = lineColor;
    $("a.btn-floor").removeClass("active");
    $("#flr-btn" + currentFloor).addClass("active");
    ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(can[currentFloor], 0,0,can[currentFloor].width, can[currentFloor].height, 0, 0, c.width,c.height);		
    currentX = parseFloat(drawing[0][0].x - views[currentFloor][0])
                          *floors[currentFloor].width/views[currentFloor][2] + bases[currentFloor].x;
    currentY = parseFloat(drawing[0][0].y - views[currentFloor][1])
                          *floors[currentFloor].height/views[currentFloor][3] + bases[currentFloor].y;
    drawCtx.beginPath();
    drawCtx.moveTo(currentX, currentY);
    if (drawing[currentSet].length > 2 || drawing.length > 2)
            window.requestAnimationFrame(changeFocus);
  }

  function changeFocus(){
    var targetZoom;
    xMin = floors[currentFloor].width;
    xMax = views[currentFloor][0];
    yMin = floors[currentFloor].height;
    yMax = views[currentFloor][1];
    for (var i = 0; i < drawing[currentSet].length; i++){
      console.log(drawing[currentSet][i].x + " " + xMin + " " + xMax + " " + drawing[currentSet][i].y + " " +  yMin + " " + yMax);
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
      console.log(xMin + " " + xMax + " " +  yMin + " " + yMax);

    }
    xMin = (xMin - views[currentFloor][0]) * floors[currentFloor].width / views[currentFloor][2];
    yMin = (yMin - views[currentFloor][1]) * floors[currentFloor].height / views[currentFloor][3];
    xMax = (xMax - views[currentFloor][0]) * floors[currentFloor].width / views[currentFloor][2];
    yMax = (yMax - views[currentFloor][1]) * floors[currentFloor].height / views[currentFloor][3];
    xWidth = (xMax - xMin) * 0.3;
    yHeight = (yMax - yMin) * 0.3;
    if (xMin - xWidth < 0)
      xMin = 0;
    else
      xMin = xMin - xWidth;
    if (yMin - yHeight < 0)
      yMin = 0;
    else
      yMin = yMin - yHeight;
    if (xMax + xWidth > floors[currentFloor].width)
      xMax = floors[currentFloor].width;
    else
      xMax = xMax + xWidth;
    if (yMax + yHeight > floors[currentFloor].height)
      yMax = floors[currentFloor].height;
    else
      yMax = yMax + yHeight;
    xWidth = xMax - xMin;
    yHeight = yMax - yMin;
    if (xWidth < yHeight * floors[currentFloor].width / floors[currentFloor].height)
      xWidth = yHeight * floors[currentFloor].width / floors[currentFloor].height;
    if (xWidth + xMin > floors[currentFloor].width)
      xMin = floors[currentFloor].width - xWidth;
    targetZoom = floors[currentFloor].width / xWidth;

    xUnitShift = (xMin-shiftX)/zoomIterations;
    yUnitShift = (yMin-shiftY)/zoomIterations;
    widthUnitShift = (targetZoom - currentZoom)/zoomIterations;
    shiftUnitsRemaining = zoomIterations;        

    window.requestAnimationFrame(routeZoom);
  }

  function routeZoom(){
    shiftX = shiftX + xUnitShift;
    shiftY = shiftY + yUnitShift;
    currentZoom = currentZoom + widthUnitShift;
    shiftUnitsRemaining = shiftUnitsRemaining - 1;
    ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(can[currentFloor], shiftX, shiftY, can[currentFloor].width/currentZoom,
                  can[currentFloor].height/currentZoom, 0,0,c.width,c.height);
    updateViewBox();
    if (shiftUnitsRemaining > 0)
      window.setTimeout(routeZoom, animationSpeed);
    else
      window.requestAnimationFrame(route);
  }

  function route(){
    shiftXMax = Math.floor(can[currentFloor].width * (1 - 1/currentZoom));
    shiftYMax = Math.floor(can[currentFloor].height * (1 - 1/currentZoom));
    if (currentEntry < drawing[currentSet].length - 1)
    currentEntry = currentEntry + 1;
    else if (currentSet < drawing.length - 1){
      currentSet++;
      currentEntry = 0;
      nextFloor = drawing[currentSet][currentFloor].floor;
      window.setTimeout(routeFloor, changeFloorPause);
    } else {
      $(".replay").removeClass("disabled");
      toggleInfoPanel('min');
      ctx.clearRect(0,0,c.width,c.height);
      ctx.drawImage(can[currentFloor],shiftX,shiftY,can[currentFloor].width/currentZoom, can[currentFloor].height/currentZoom,
                    0,0,can[currentFloor].width, can[currentFloor].height);
      ctx.drawImage(draw,shiftX,shiftY,can[currentFloor].width/currentZoom, can[currentFloor].height/currentZoom,
                    0,0,can[currentFloor].width, can[currentFloor].height);
      con[currentFloor].drawImage(draw, 0, 0, draw.width, draw.height, 0, 0, can[currentFloor].width, can[currentFloor].height);
      animating = false;
      return;
    }
    switch (drawing[currentSet][currentEntry].type){
      case "L": 
            xDist = (parseFloat(drawing[currentSet][currentEntry].x) - views[currentFloor][0])
                    * floors[currentFloor].width/views[currentFloor][2] - currentX 
                    + bases[currentFloor].x;
            yDist = (parseFloat(drawing[currentSet][currentEntry].y) - views[currentFloor][1])
                    * floors[currentFloor].height/views[currentFloor][3] - currentY
                    + bases[currentFloor].y;
            len = Math.sqrt(xDist*xDist + yDist*yDist);
            unit = drawLength/len;
            len = Math.ceil(len/drawLength);
            window.requestAnimationFrame(drawLine);
            break;
      case "Q":
            window.requestAnimationFrame(drawQuad);
            break;
      default:
            return;
    } 
  }

  function routeFloor(){
    con[currentFloor].drawImage(draw, 0, 0, draw.width, draw.height, 0, 0, can[currentFloor].width, can[currentFloor].height);
    $("#flr-btn" + currentFloor).removeClass("active");
    changeSVGFloor(nextFloor);
    currentFloor = nextFloor;
    drawCtx.clearRect(0,0,draw.width,draw.height);
    draw.width = can[currentFloor].width;
    draw.height = can[currentFloor].height;
    drawCtx.lineWidth = lineWidth;
    drawCtx.strokeStyle = lineColor;
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
    drawCtx.beginPath();
    drawCtx.moveTo(currentX,currentY);
    window.setTimeout(changeFocus, startFloorPause);
  }

  function drawLine(){
    var nextX = currentX + unit*xDist;
    var nextY = currentY + unit*yDist;
    drawCtx.lineTo(nextX, nextY);
    drawCtx.stroke();
    currentX = nextX;
    currentY = nextY;
    requestAnimationFrame(drawCanvas);				
  }
  
  function drawCanvas(){
    ctx.drawImage(draw, shiftX, shiftY, draw.width/currentZoom, 
                  draw.height/currentZoom, 0,0,c.width,c.height);
    len = len-1;
    if (len > 0) setTimeout(drawLine, animationSpeed);
    else {
       requestAnimationFrame(route);
     }
  }
  
  function drawQuad(){
    var curveX = (drawing[currentSet][currentEntry].cx - views[currentFloor][0]) 
                 * floors[currentFloor].width / views[currentFloor][2] + bases[currentFloor].x;
    var curveY = (drawing[currentSet][currentEntry].cy - views[currentFloor][1]) 
                 * floors[currentFloor].height / views[currentFloor][3] + bases[currentFloor].y;
    currentX = (drawing[currentSet][currentEntry].x - views[currentFloor][0]) 
                 * floors[currentFloor].width / views[currentFloor][2] + bases[currentFloor].x;
    currentY = (drawing[currentSet][currentEntry].y - views[currentFloor][1]) 
                 * floors[currentFloor].height / views[currentFloor][3] + bases[currentFloor].y;
    drawCtx.quadraticCurveTo(curveX, curveY, currentX, currentY);
    drawCtx.stroke();
    window.requestAnimationFrame(drawQuadFrame);        
  }

  function drawQuadFrame(){
    ctx.drawImage(draw, shiftX, shiftY, draw.width/currentZoom, 
                  draw.height/currentZoom, 0,0,c.width,c.height);
    window.requestAnimationFrame(route);
  }
}  

function updateViewBox(){
  $("#floor" + currentFloor + " svg").attr("viewbox", function(){
    return ((shiftX*views[currentFloor][2]/can[currentFloor].width + views[currentFloor][0]) + " " +
           (shiftY*views[currentFloor][3]/can[currentFloor].height + views[currentFloor][1]) + " " + 
           views[currentFloor][2]/currentZoom + " " + views[currentFloor][3]/currentZoom);
  });
}
function changeSVGFloor(newFloor){
  $("#floor" + currentFloor).css("display", "none");
  $("#floor" + newFloor).css("display", "inline");
  $("#floor" + newFloor + " svg").attr("viewbox", function(){
    return (views[newFloor][0] + " " + views[newFloor][1] + "  " + 
            views[newFloor][2] + " " + views[newFloor][3]);
  });
}
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
    destination = $(this).attr('id');
    $(document).trigger('show:roomClick', [ { room_id : $(this).attr('id') } ] );
    
    event.preventDefault();
  });

  $(document).on('show:roomClick', function(e, data){
    console.log("Clicked room: " + data.room_id);
    drawing = $("#svgImage").wayfinding('routeTo', destination);
    setRedirectToHome(); // reset the home page return timer
    if (drawing.length > 0)
      toggleInfoPanel('min');
      $.get( "/room/" + destination.substr(1) + ".json", function( data ) {
        showInfo(data);
      });
      routingFunctions();
  });

  $(".accessible").click(function(e) {
    e.preventDefault();
    setRedirectToHome();
    $("a.accessible").toggleClass('active');
    $('#svgImage').wayfinding('accessibleRoute', !$('#svgImage').wayfinding('accessibleRoute'), 
                              function() {
      if($('.replay').hasClass("disabled") == false) {
        drawing = $('#svgImage').wayfinding('routeTo', destination);
        $('.replay').addClass('disabled');
        routingFunctions();
      }
    });
  });

  $("a.btn-floor").click(function(event){
    console.log($(this).attr('id'));
    $(document).trigger('show:floorChange', [ { floor_id : $(this).attr('id') } ] );
    event.preventDefault();
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
    $("#myCanvas").css("height",c.height);
    ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(can[currentFloor],shiftX,shiftX,floors[currentFloor].width/currentZoom, 
                  floors[currentFloor].height/currentZoom,0,0,c.width,c.height);
  });

  $('.replay').click(function(e) {
    e.preventDefault();
    if (drawing.length > 0 && !$(this).hasClass('disabled')) {
      routingFunctions();
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
  var touches = event.touches;
  var touch = [];
  touch[0] = {x: parseInt(touches[0].pageX), y: parseInt(touches[0].pageY)};
  if (event.touches.length == 1 && down == true){    
    shiftX = shiftX - (touch[0].x - touchesRecord[0].pageX) * currentZoom;
    shiftY = shiftY - (touch[0].y - touchesRecord[0].pageY) * currentZoom;
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
    currentShiftX = Math.floor((2*currentShiftX+DWidth/currentZoom)/2);
    currentShiftY = Math.floor((2*currentShiftY+DHeight/currentZoom)/2);
    if (dx1 >= dx0 && dy1 >= dy0){
      var maxi;
      if (dx1 - dx0 > dy1 - dy0)
        maxi = (dx1-dx0)/5000;
      else
        maxi = (dy1-dy0)/5000;
        currentZoom = currentZoom + maxi;  
      } else if (dx1 <= dx0 && dy1 <= dy0){
        var maxi;
        if (dx0 - dx1 > dy0 - dy1)
          maxi = (dx0-dx1)/5000;
        else
          maxi = (dy0-dy1)/5000;
        currentZoom = currentZoom - maxi;
      }
      if (currentZoom < 1)
        currentZoom = 1;
      else if (currentZoom > 4)
        currentZoom = 4;
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
      $('#' + maps[currentFloor] + " svg").attr("viewBox", function(){
        return Math.floor(shiftX*convertX) + " " + Math.floor(shiftY*convertY) + " " + Math.floor(646/currentZoom) + " " + 
               Math.floor(346/currentZoom);
      });
    }
    event.preventDefault();
  }

  function touchEnd(event) {
    if (event.touches.length == 0)
    down = false;
  }

  function resize(){
    c.width = parseInt($('#myCanvas').css('width'));
    $('#myCanvas').css('height', function(){
      return Math.floor(c.width*floors[currentFloor].height/floors[currentFloor].width);
    });
    c.height = parseInt($('#myCanvas').css('height'));
    $('svg').attr({'width':c.width,'height':c.height});
    ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(can[currentFloor], shiftX, shiftY, can[currentFloor].width/currentZoom,
                  can[currentFloor].height/currentZoom, 0,0,c.width,c.height);
  }

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

  var minMaxInfo = function (state) {
    state = state || 'toggle';
    var width = $('#destination-view').outerWidth();
    if (state == 'min' || $('#destination-view').css('right') == '0px') {
      $('#destination-view').css('right', -width+20);
      $('i.btn-min-max').removeClass('icon-right-arrow').addClass('icon-left-arrow');
    } else {
      $('#destination-view').css('right', 0);
      $('i.btn-min-max').removeClass('icon-left-arrow').addClass('icon-right-arrow');
    }
  }
