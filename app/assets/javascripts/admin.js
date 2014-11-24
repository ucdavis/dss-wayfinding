//= require redirect

var ready;
ready = function() {
  if ( typeof notice !== 'undefined' && notice ) {
    $(".alert").addClass("alert-success").css('visibility','visible');
    $(".alert span.notice").text(notice);
  } else if ( typeof error !== 'undefined' && error ) {
    $(".alert").addClass("alert-danger").css('visibility','visible');
    $(".alert span.notice").text(error);
  }

  $("#originform").on('ajax:success',function(event, data){
    if (typeof data.notice !== 'undefined' ) {
      $(".alert").addClass("alert-success").css('visibility','visible');
      $(".alert span.notice").text(data.notice);
    } else if (typeof data.error !== 'undefined' ) {
      $(".alert").addClass("alert-danger").css('visibility','visible');
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
    $.get( "/dataStore/stats.json", function( data ) {
      if ( progress == null ) {
        // Set interval to keep checking stats
        statsInterval = setInterval(function(){getCacheStats();}, 3000);
      }

      if (typeof data == 'undefined' || data.progress == "Completed" ) {
        // Stop checking if no build in progress
        clearInterval(statsInterval);
        lastBuild = new Date(data.startTime);
        lastBuild = lastBuild.getMonth() + '/' + lastBuild.getDate() + '/' + lastBuild.getFullYear()
          + ' ' + lastBuild.getHours() + ':' + lastBuild.getMinutes();
        progress = "No cache building in porgress.. Last build: " + lastBuild + " ( Took " + data.totalTime + " )";
        percentage = '100%';
      } else {
        // Expand the SVG Management section once
        if (!progress) $('#collapseMaps').collapse('toggle');

        // Update values if process is not completed
        progress = data.progress;
        percentage = data.progress;
      }

      $('#cacheStats').css('width', percentage);
      $('#cacheStats').text(progress);
    }).fail(function() {
      console.error("Could not fetch cache building progress");
      clearInterval(statsInterval);
    });
  }

  getCacheStats();

};

$(document).ready(ready);
$(document).on('page:load', ready);
