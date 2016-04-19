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

var minMaxInfo = function (state) {
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
    minMaxInfo('min');
    $('#destination-view .min-max').on('click', function() {
      minMaxInfo();
    });

    handleLinksWithJS();
  } else {
    console.warn('Object not found in directory');
    $('#destination-view').css('right', '-1000px');
    $('#destination-view-bg').css('right', '-1000px');
  }
}
