//= require redirect
//= require animate

$(document).ready(function(){

  if ( typeof notice !== 'undefined' && notice ) {
    $(".alert").addClass("alert-success").css('visibility','visible');
    $(".alert span.notice").text(notice);
  } else if ( typeof error !== 'undefined' && error ) {
    $(".alert").addClass("alert-danger").css('visibility','visible');
    $(".alert span.notice").text(error);
  }

  $(".alert button.close").click(function() {
    $(".alert").attr('class', 'alert').css('visibility','hidden');
  });

  $("#originform").on('ajax:success',function(event, data){
    if (typeof data.notice !== 'undefined' ) {
      $(".alert").addClass("alert-success").css('visibility','visible');
      $(".alert span.notice").text(data.notice);
    } else if (typeof data.error !== 'undefined' ) {
      $(".alert").addClass("alert-danger").css('visibility','visible');
      $(".alert span.notice").text(data.error);
    }
    if (typeof data.origin !== 'undefined' ) $("input#origin").val(data.origin);
  }).on('ajax:error',function(xhr, status, error){
    $(".alert").addClass("alert-danger").show();
    $(".alert span.notice").text("Error communicating with server!");
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
});
