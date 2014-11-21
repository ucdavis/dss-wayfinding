//= require redirect

$(function() {
  $(".right-btn-container.search").remove();
  $("input#search").bind("change paste keyup", function() {
    var query = $("#search").val();

    if (query.length < 3) {
      if (query.length == 0) {
        $('#result').empty();
      }
      else {
        $('#result').html('<div align="center">You need at least 3 charachters</div>');
      }
      return;
    }

    $.post( "/search", {q: query}, function( data ) {
      if(data.directory_objects.length) {
        $('#result').empty();
      } else {
        $('#result').html('<div align="center">No results found for your query</div>');
      }

      data.directory_objects.forEach( function(directory_object) {
        var tmpl;
        if (directory_object.type == 'Person') {
          tmpl = '<li>'
            + '<a href="/directory/' + directory_object.id +'" class="people-card">'
              + '<h3>' + directory_object.first + ' ' + directory_object.last +'</h3>'
              + '<p>';
          if (directory_object.rooms.length > 0) {
            tmpl = tmpl + directory_object.rooms[0].room_number + ' ';
          }
          if (directory_object.department) {
            tmpl = tmpl + directory_object.department.title;
          }
          tmpl = tmpl + '&nbsp</p>'
              + '<p>' + directory_object.email + '&nbsp;</p>'
              + '<p>' + directory_object.phone + '&nbsp;</p>'
            + '</a>'
          + '</li>';
        } else if (directory_object.type == 'Event') {
          tmpl = '<li>'
            + '<a href="/directory/' + directory_object.id +'" class="events-card">'
              + '<h3>' + directory_object.title +'</h3>'
              + '<p>';
          if (directory_object.room) {
            tmpl = tmpl + directory_object.room.room_number;
          }
          tmpl = tmpl + '&nbsp</p><p>';
          if (directory_object.link) {
            tmpl = tmpl + directory_object.link;
          }
          tmpl = tmpl + '&nbsp</p><p>';
          if (directory_object.department) {
            tmpl = tmpl + directory_object.department.title;
          }
            + '&nbsp</p></a>'
          + '</li>';
        } else if (directory_object.type == 'Department') {
          tmpl = '<li>'
            + '<a href="/directory/' + directory_object.id +'" class="departments-card">'
              + '<h3>' + directory_object.title +'</h3>'
              + '<p>';
          if (directory_object.room) {
            tmpl = tmpl + directory_object.room.room_number;
          }
          tmpl = tmpl + '&nbsp</p>'
            + '</a>'
          + '</li>';
        } else if (directory_object.type == 'Room') {
          tmpl = '<li>'
            + '<a href="/directory/' + directory_object.id +'" class="rooms-card">'
              + '<h3>' + directory_object.room_number +'</h3>'
              + '<p>';
              if (directory_object.name) {
                tmpl = tmpl + directory_object.name;
              }
              tmpl = tmpl + '&nbsp</p>'
            + '</a>'
          + '</li>';
       }
        $('#result').append(tmpl);
      })
    }).fail(function() {
      console.error("Could not complete search");
    });
  })
});
