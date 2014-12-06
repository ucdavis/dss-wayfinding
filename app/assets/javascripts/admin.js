//= require redirect

var ready;
ready = function() {
  if ( typeof notice !== 'undefined' && notice ) {
    $(".alert").addClass("alert-success").css('display','block');
    $(".alert span.notice").text(notice);
  } else if ( typeof error !== 'undefined' && error ) {
    $(".alert").addClass("alert-danger").css('display','block');
    $(".alert span.notice").text(error);
  }

  $("#originform").on('ajax:success',function(event, data){
    if (typeof data.notice !== 'undefined' ) {
      $(".alert").addClass("alert-success").css('display','block');
      $(".alert span.notice").text(data.notice);
    } else if (typeof data.error !== 'undefined' ) {
      $(".alert").addClass("alert-danger").css('display','block');
      $(".alert span.notice").text(data.error);
    }
    if (typeof data.origin !== 'undefined' ) $("input#origin").val(data.origin);

    setTimeout(function() {
      $('.alert').fadeOut();
    }, 2500);
  }).on('ajax:error',function(xhr, status, error){
    $(".alert").addClass("alert-danger").show();
    $(".alert span.notice").text("Error communicating with server!");

    setTimeout(function() {
      $('.alert').fadeOut();
    }, 2500);
  });

  $(".deptform").on('ajax:success',function(event, data){
    if (typeof data.notice !== 'undefined' ) {
      // Clear others
      $('.deptform input[type="submit"]').attr('class','btn btn-default');
      $('.deptform p.status').hide();
      // Display status
      $(this).find('input[type="submit"]').addClass('btn-success')
      $(this).find('.form-group').append('<p class="help-block col-sm-2 status">Saved successfully...</p>');
    } else if (typeof data.error !== 'undefined' ) {
      // Clear others
      $('.deptform input[type="submit"]').attr('class','btn btn-default');
      $('.deptform p.status').hide();
      // Display status
      $(this).find('input[type="submit"]').addClass('btn-danger')
      $(this).find('.form-group').append('<p class="help-block col-sm-2 status">Error saving...</p>');
    }
  });

  // Build caches progress bar
  var progress = null;
  var percantage = '100%';
  var statsInterval;
  var getCacheStats = function () {
    $.get( "/map_stats.json", function( data ) {
      if ( progress == null ) {
        // Set interval to keep checking stats
        statsInterval = setInterval(function(){getCacheStats();}, 10000);
      }

      if (typeof data == 'undefined' || data.progress == "Completed" ) {
        // Stop checking if no build in progress
        clearInterval(statsInterval);
        lastBuild = new Date(data.startTime);
        lastBuild = lastBuild.getMonth() + '/' + lastBuild.getDate() + '/' + lastBuild.getFullYear()
          + ' ' + lastBuild.getHours() + ':' + lastBuild.getMinutes();
        progress = "No cache building in porgress.. Last build: " + lastBuild + " ( Took " + data.totalTime + " )";
        percentage = '100%';

        // Update DOM
        $(".cache-building").addClass('hidden');
        $('.cache-stats').text(progress);
        $("#svg-upload-form :input").attr("disabled", false);
      } else {
        // Apply the following only once, on page load if caches are being built
        if (!progress) {
          $(".cache-building").removeClass('hidden');
          $('.cache-stats').text("Cache building in progress...").addClass('text-danger');
          $("#svg-upload-form :input").attr("disabled", true);
        }

        // Update values if process is not completed
        progress = data.progress;
        percentage = data.progress;
      }

      $('#cache-progress').css('width', percentage);
      $('#cache-progress').text(progress);
    }).fail(function() {
      console.error("Could not fetch cache building progress");
      clearInterval(statsInterval);
    });
  }

  // Get cache stats on page load
  getCacheStats();

  // Directory search
  $('.admin-directory-list').on('keyup', 'input#search-directory', function (e) {
    var query = $(this).val();
    $('a.directory-item').show();
    if (query.length > 2) {
      $('a.directory-item').each(function () {
        if ($(this).text().toLowerCase().indexOf(query.toLowerCase()) == -1) $(this).hide();
      });
    }
  });

  // Directory List
  $('.admin-directory-list').on('click', 'a#new-object', function (e) {
    e.preventDefault();

    $('.admin-directory-list a').removeClass('active');
    $(this).addClass('active');

    // Change form method to post
    $('#directory-form').attr('method','post');
    $('#directory-form button#submit').text('Create');

    // Reset form
    $("#directory-form input[name = 'id']").val('');
    $(':input','#directory-form')
     .not(':button, :submit, :reset, :hidden')
     .val('')
     .removeAttr('checked')
     .removeAttr('selected');
  });

  // Directory Form
  $('.admin-directory-list').on('click', 'a.directory-item', function (e) {
    e.preventDefault();

    $('.admin-directory-list a').removeClass('active');
    $(this).addClass('active');

    // Change form method to put
    $('#directory-form').attr('method','put');
    $('#directory-form button#submit').text('Update');

    // Set form elements
    var item = $(this).data('item');
    item.room = $(this).data('room');
    item.rooms = $(this).data('rooms');
    item.department = $(this).data('department');

    for (var key in item) {
      $("#directory-form #" + key).val(item[key]);
    }
  });

  // Directory Form Callbacks
  $('#directory-form').on('ajax:success',function(event, data, xhr){
    var type = $('input#type', this).val();
    var el = $('#directory_' + data.id);

    $(".alert").addClass("alert-success").css('display','block');

    switch (type) {
    case "Department":
      $(".alert span.notice").text(type + " " + data.title + " was saved successfully");

      if (el.length) {
        el.text(data.title);
      } else {
        $('#' + type + '-admin-list').append('<a href="#" class="list-group-item directory-item"'
        + 'id="directory_' + data.id + '" data-type="' + type + '" data-item="' + data + '"'
        + 'data-room="' + $('input#room').val() + '">'
        + data.title + '</a>');
      }
      break;
    case "Person":
      $(".alert span.notice").text(type + " " + data.first + " " + data.last + " was saved successfully");

      if (el.length) {
        el.text(data.first + " " + data.last);
      } else {
        $('#' + type + '-admin-list').append('<a href="#" class="list-group-item directory-item"'
        + 'id="directory_' + data.id + '" data-type="' + type + '" data-item="' + data + '"'
        + 'data-department="' + $('select#department').val() + '"'
        + 'data-rooms="' + $('select#rooms').val() + '">'
        + data.first + " " + data.last + '</a>');
      }
      break;
    case "Room":
      $(".alert span.notice").text(type + " " + data.room_number + " was saved successfully");

      if (el.length) {
        el.text(data.room_number);
      } else {
        $('#' + type + '-admin-list').append('<a href="#" class="list-group-item directory-item"'
        + 'id="directory_' + data.id + '" data-type="' + type + '" data-item="' + data + '">'
        + data.room_number + '</a>');
      }
      break;
    }

    setTimeout(function() {
      $('.alert').fadeOut();
    }, 2500);
  }).on('ajax:error',function(xhr, status, error){
    console.error('Error submitting form', error);
  });

};

$(document).ready(ready);
$(document).on('page:load', ready);
