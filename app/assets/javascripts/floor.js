$(function() {
  // Detect a button click to change the floor
  $("a.btn-floor").click(function(event) {
    console.log("detected floor change!");
    event.preventDefault();

    // Hide other floors and display the selected one
    $("#map").children('div').css("display", "none");
    $("#" + this.dataset.mapid).css("display", "inline-block");

    // Make the clicked button active
    $("a.btn-floor").removeClass('active');
    $(this).addClass('active');
  });
});
