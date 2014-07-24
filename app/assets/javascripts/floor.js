$(function() {
  $("a.btn-floor").click(function(event) {
    console.log("detected floor change!");
    event.preventDefault();
    $("#map").children('div').css("display", "none");
    $("#" + this.dataset.mapid).css("display", "inline-block");
  });
});