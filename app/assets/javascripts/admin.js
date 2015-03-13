//= require redirect

var ready;
ready = function() {

  //
  // _notice
  //
  //    Displays notices (information about successes and errors) to the user
  //    that display for about 2.5s.
  //
  
  var _notice = function(type, notice) {
      cssType = type === 'success' ? 'success' : 'danger';

      $(".alert").addClass("alert-" + cssType).css('display','block');
      $(".alert span.notice").text(notice);
      setTimeout(function() {
          $('.alert').fadeOut();
      }, 2500);
  };

  //
  // success_notice and error_notice
  //
  //    Helper functions for _notice
  //
  
  var success_notice = _.partial(_notice, 'success');
  var error_notice = _.partial(_notice, 'error');

  if ( typeof notice !== 'undefined' && notice ) {
    $(".alert").addClass("alert-success").css('display','block');
    $(".alert span.notice").text(notice);
  } else if ( typeof error !== 'undefined' && error ) {
    $(".alert").addClass("alert-danger").css('display','block');
    $(".alert span.notice").text(error);
  }

  $('#admin-menu ul.nav-tabs li:first-child, #admin-menu .tab-content .tab-pane:first-child').addClass('active');

  $("#originform").on('ajax:success',function(event, data){
    if (typeof data.notice !== 'undefined' ) {
      success_notice(data.notice);
    } else if (typeof data.error !== 'undefined' ) {
      error_notice(data.error);
    }
    if (typeof data.origin !== 'undefined' ) $("input#origin").val(data.origin);
  }).on('ajax:error',function(xhr, status, error){
      error_notice("Error communicating with server!");
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
        progress = "No cache building in progress.. Last build: " + lastBuild + " ( Took " + data.totalTime + " )";
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
  var resetDirectoryForm = function() {
    $('.admin-directory-list a').removeClass('active');
    $('.directory-form button#delete').addClass('hidden');
    $('.admin-directory-list a#new-object').addClass('active');

    // Change form method to post
    $('.directory-form').attr('method','post');
    $('.directory-form').show();

    // Reset action urls
    $('.directory-form').each(function(i,f){
      var action = $(f).attr('action');
      $(f).attr('action', action.split('/').slice(0,2).join('/'));
    });

    $('.directory-form button#submit').text('Create');
    $('.directory-form button#delete').text('Delete');

    // Reset form
    $(".directory-form input[name = 'id']").val('');
    $(':input','.directory-form')
     .not(':button, :submit, :reset, :hidden')
     .val('')
     .removeAttr('checked')
     .removeAttr('selected');
  }

  // When 'New Item' button in the directory list is clicked
  $('.admin-directory-list').on('click', 'a#new-object', function (e) {
    e.preventDefault();
    $('.directory-form').show();
    resetDirectoryForm();
  });

  // When switching between tabs
  $('#admin-menu a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    resetDirectoryForm();

    // Hide the form for rooms (Can't create rooms)
    if ($(this).hasClass('rooms')) {
      $('.directory-form').hide();
    }
  });

  // Directory Form
  $('.admin-directory-list').on('click', 'a.directory-item', function (e) {
    e.preventDefault();
    var item = $(this).data('item');

    $('#' + item.type + '-form').show();

    $('.admin-directory-list a').removeClass('active');
    $(this).addClass('active');

    // Change form method to put
    $('#' + item.type + '-form').attr('method','put');
    $('#' + item.type + '-form').attr('action',$(this).data('action'));
    $('#' + item.type + '-form button#submit').text('Update');
    $('#' + item.type + '-form button#delete').removeClass('hidden');

    // Set form elements
    item.room = $(this).data('room');
    item.rooms = $(this).data('rooms');
    item.department = $(this).data('department');

    for (var key in item) {
      $("#" + item.type + "-form #" + key).val(item[key]);
    }
  });

  // 
  // validNumber
  //
  //    Tests whether or not a phone number is a valid five-, seven-, or
  //    ten-digit phone number. Compares given number to a version that strips
  //    everything but valid non-numeric characters.
  //
  //    See: http://stackoverflow.com/questions/123559/a-comprehensive-regex-
  //         for-phone-number-validation#comment13319834_123681
  //
  //    Arguments:
  //        phone: (string) Phone number to test.
  //
  //    Returns: Whether or not the given string is a valid phone number.
  //
  
  var validNumber = function(phone) {
      stripped = phone.trim();
      trimmedNumber = stripped.replace(/[^\dx]/g, "")
                              .replace(/x\d*/g, "");
      trimmedLength = trimmedNumber.length;

      // Double check phone number is five, seven, or ten digits
      if (trimmedLength !== 5  && trimmedLength !== 7  &&
          trimmedLength !== 10 && trimmedLength !== 11) {
              return false;
      }

      // Allow numbers, +, -, x, (, and ). Anything else renders the number
      // invalid.
      if (stripped.replace(/[^\d+-x)( ]/g, "") === stripped)
          return true;

      return false; 
  };

  $('.directory-form #submit').on('click', function(event) {
      var type = $('input#type', this.form).val();

      var stop = function() {
          event.preventDefault();
          event.stopPropagation();
      };

      switch (type) {
          case "Person":
              // Names can't be empty
              if (!(this.form.elements.first.value && this.form.elements.last.value)) {
                  error_notice("Missing first and/or last name. Please enter both a first and a last name.");
                  stop();
                  return false;
              }

              // Validate phone numbers. They can be empty (empty phone number
              // evaluates to false and prevents the following if statement from
              // continuing, preventing it from stopping form submission). 
              phoneNumber = this.form.elements.phone.value;
              if (phoneNumber && !validNumber(phoneNumber)) {
                  error_notice("Please enter a valid phone number.");
                  stop();
                  return false;
              }

              // Rely on browser support for <input type="email"> for now.
          break;
      }
  });

  // Directory Form Callbacks
  $('.directory-form').on('ajax:success',function(event, data, xhr){
    var type = $('input#type', this).val();
    var el = $('#directory_' + data.id);

    switch (type) {
    case "Department":
      if (el.length) {
        el.text(data.department);
      } else {
        el = $('<a href="#" class="list-group-item directory-item"'
        + 'id="directory_' + data.id + '">'
        + data.department + '</a>')
        $('#' + type + '-admin-list').append(el);
      }

      el.data('type',type);
      el.data('item',data);
      el.data('room',$('input#room').val());
      break;
    case "Person":
      if (el.length) {
        el.text(data.name);
      } else {
        el = $('<a href="#" class="list-group-item directory-item"'
        + 'id="directory_' + data.id + '">'
        + data.name + '</a>')
        $('#' + type + '-admin-list').append(el);
      }

      el.data('type',type);
      el.data('item',data);
      el.data('department',$('select#department').val());
      el.data('rooms',$('select#rooms').val());
      break;
    case "Room":
      el.data('item',data);

      break;
    }

    resetDirectoryForm();

    success_notice(type + ' ' + data.name + ' was created successfully');
  }).on('ajax:error',function(xhr, status, error){
    error_notice(status.responseJSON.message);
  });

  $('.directory-form').on('click', 'button#delete', function (e) {
    if ($(this).text() == 'Delete') {
      $(this).text('Are you sure?')
    } else {
      var id = $(this).closest('form').children('input#id').val();
      $.ajax({
        url: '/directory/' + id,
        data: { authenticity_token: document.csrf },
        type: 'DELETE',
        complete: function(jqXHR) {
          if(jqXHR.readyState === 4) {
            console.log('Object deleted successfully')

            var el = $('#directory_' + jqXHR.responseJSON.id);
            el.remove();
            $('.admin-directory-list a#new-object').addClass('active');
            resetDirectoryForm();

            success_notice(jqXHR.responseJSON.message);
          }
        }
      });
    }
  });

};

$(document).ready(ready);
$(document).on('page:load', ready);
