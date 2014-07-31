//= require redirect
//= require animate

$(document).ready(function(){
  if ( notice ) {
    $(".alert").addClass("alert-success").css('visibility','visible');
    $(".alert span.notice").text(notice);
  } else if ( error ) {
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
});
