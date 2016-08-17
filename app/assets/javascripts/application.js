//= require jquery
//= require jquery_ujs
//= require bootstrap
//= require underscore
//= redirect

/**
 * Escapes a string ** required for replaceAll **
 * // http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
} // functione escapeRegExp

/**
 * This function searches the piece given and replaces it with the second piece
 * @param {String} search - the piece we don't want
 * @param {String} replacement - the piece we want instead
 */
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    search = escapeRegExp(search);
    return target.replace(new RegExp(search, 'g'), replacement);
}; // function replaceAll

var handleLinksWithJS = function () {
  // Handle left nav links using javascript (fixes guided mode issue on iPad)
  var a=$('a[href]:not([href^="\\#"])');

  for(var i=0;i<a.length;i++)
  {
    a[i].onclick=function()
    {
      window.location=this.getAttribute("href");
      return false;
    }
  }
}

$(function() {
  handleLinksWithJS();
  document.csrf = $('meta[name="csrf-token"]')[0].content;
});

// Add compatibility classes to required elements if user agent is determined to be mobile safari
$(document).ready(function() {
  if ( (navigator.userAgent.match(/(iPod|iPhone)/) != null) && (navigator.userAgent.match(/AppleWebKit/) != null) ) {
    $("#accessibility-nav").addClass("safari-mobile-compatibility");
    $("body").addClass("safari-mobile-compatibility");
    $("#map").addClass("safari-mobile-compatibility");
    $(".landing-ul").addClass("safari-mobile-compatibility");
  }

  $("#search").on("keyup", function() {
    if ($("#search").val() != "") {
      $("#result").show();
    }
  });

  $("#search").on("focus", function() {
    if ($("#search").val() != "") {
      $("#result").show();
    }
  });

  $(document).mouseup(function(e) {
    var container = $("#result, #search");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      $("#result").hide();
    }
  });
});

function navigate() {
  var start_loc = $("input[name=start_loc]").val();
  var end_loc = $("input[name=end_loc]").val();
  if (start_loc != "" && end_loc != "") {
    window.location.href = "/start/" + start_loc + "/end/" + end_loc;
  }
}

// Searching
var pluralize = function (word) {
  if (word == 'Person') return 'People';
  else return word + 's';
}

var categories = [];
var addCategoryIfDoesNotExist = function (category) {
  if ( categories.indexOf(category) > -1 ) return;

  categories.push(category);
  $('#result table').append("<tr class='category-header' id='category_" + category + "'><td class=\"margin-none\">" + pluralize(category) + "</td></tr>");
}

var displayResults = function () {
  $('.ui-input-clear').hide();	//hide Clear text
  var query = $("#search").val();

  if (query.length < 3) {
    if (query.length == 0) {
      $('#result').empty();
    }
    else {
      $('#result').html('<div class="search-error" align="center">You need at least 3 characters</div>');
    }
    return;
  }

  $.post( "/search", {q: query.trim(), authenticity_token: document.csrf}, function( data ) {
    if(data.directory_objects.length) {
      $('#result').html('<table class="table width-100"></table>');
      categories.length = 0;
    } else {
      $('#result').html('<div class="search-error" align="center">No results found for your query</div>');
    }

    console.log(data.directory_objects[0]);
    data.directory_objects.forEach( function(directory_object, index) {
      console.log("Index is : " + index);
      console.log(directory_object);
      var tmpl;
      addCategoryIfDoesNotExist(directory_object.type);
      if (directory_object.type == 'Person') {
        tmpl = '<tr class="clickable-row" data-url="/directory/' + directory_object.id +'" >'
        + '<td><h3>' + directory_object.first + ' ' + directory_object.last +'</h3>';
        if (directory_object.rooms.length > 0) {
          tmpl = tmpl + '<span class="dir-row-field">' + directory_object.rooms[0].room_number + '</span>';
        }
        if (directory_object.department) {
          tmpl = tmpl + '<span class="dir-row-field">' + directory_object.department.title + '</span>';
        }
        tmpl = tmpl
            + '<span class="dir-row-field">' + ( directory_object.email || '' ) + '</span>'
            + '<span class="dir-row-field">' + ( directory_object.phone || '' ) + '</span>'
          + '</td>'
        + '</tr>';
      } else if (directory_object.type == 'Event') {
        tmpl = '<tr class="clickable-row" data-url="/directory/' + directory_object.id +'">'
        + '<td><h3>' + directory_object.title +'</h3>';
        if (directory_object.room) {
          tmpl = tmpl + '<span class="dir-row-field">' + directory_object.room.room_number + '</span>';
        }
        if (directory_object.link) {
          tmpl = tmpl + '<span class="dir-row-field">' + directory_object.link + '</span>';
        }
        if (directory_object.department) {
          tmpl = tmpl + '<span class="dir-row-field">' + directory_object.department.title + '</span>';
        }
        tmpl = tmpl + '</td></tr>';
      } else if (directory_object.type == 'Department') {
        tmpl = '<tr class="clickable-row" data-url="/directory/' + directory_object.id +'">'
        + '<td><h3>' + directory_object.title +'</h3>';

        if (directory_object.room) {
          tmpl = tmpl + '<span class="dir-row-field">' + directory_object.room.room_number + '</span>';
        }

        tmpl = tmpl + '</td></tr>';
      } else if (directory_object.type == 'Room') {
        tmpl = '<tr class="clickable-row" data-url="/directory/' + directory_object.id +'">'
        + '<td><h3>' + directory_object.room_number +'</h3>';
        if (directory_object.name) {
          tmpl = tmpl + '<span class="dir-row-field">' + directory_object.name + '</span>';
        }
        tmpl = tmpl + '</td></tr>';
      }
      $('#result table').append(tmpl);

      // Add click listener
      $(".clickable-row").on('click', function() {
        window.document.location = $(this).data("url");
      });
    })
  }).fail(function() {
    console.error("Could not complete search");
  });
}

$(function() {
  var searchTimeout;

  $(".right-btn-container.search").remove();
  displayResults();
  $("input#search").bind("change paste keyup", function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(displayResults, 300);
  });
});
