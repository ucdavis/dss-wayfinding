//= require redirect
//= require jquery.panzoom
//= require wayfinding.datastore
//= require jquery.wayfinding

$(function() {
  // Detect a button click to change the floor
  $("a.btn-floor").click(function(event) {
    event.preventDefault();

    $("#map").wayfinding("currentMap", this.dataset.mapid);
  });
});

var minMaxInfo = function (el) {
  var width = $('#destination-view').outerWidth();
  if ($('#destination-view').css('right') == '0px') {
    $('#destination-view').css('right', -width+20);
    $(el).removeClass('glyphicon-circle-arrow-right').addClass('glyphicon-circle-arrow-left');
  } else {
    $('#destination-view').css('right', 0);
    $(el).removeClass('glyphicon-circle-arrow-left').addClass('glyphicon-circle-arrow-right');
  }
}

var showInfo = function (data, similar, class_suffix) {
  class_suffix = class_suffix || 'rooms'

  $('#destination-view h2, #destination-view span').remove();
  $('#destination-view h1').addClass('btn-' + class_suffix);
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

    if (similar) {
      $('#destination-view').append("<h2>Search Similar</h2><a href='/search?q=" + similar + "'><span class='label label-default btn-departments'>" + similar + "</span></a>");
    }

    $('#destination-view').css('right', 0);
    $('#destination-view .min-max').on('click', function() {
      minMaxInfo(this);
    });
  } else {
    console.warn('Object not found in directory');
    $('#destination-view').css('right', '-1000px');
  }
}
