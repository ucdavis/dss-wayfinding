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

function showInfo(data, similar, class_suffix) {
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
  } else {
    console.warn('Object not found in directory');
    $('#destination-view').css('right', '-1000px');
  }
}
