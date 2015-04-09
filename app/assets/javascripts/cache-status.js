// Build caches progress bar
var progress = null;
var percantage = '100%';
var statsInterval;
// refresh variable is set to true if called from AngularJS controller (for
// reloading these settings in the AngularJS partial
var getCacheStats = function (refresh) {
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
    console.log($('.cache-stats'));
    // Apply the following only once, on page load if caches are being built
    if (!progress || refresh) {
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

  // Double check phone number is five, seven, or ten digits without an
  // extension
  if (trimmedLength !== 5  && trimmedLength !== 7  &&
      trimmedLength !== 10 && trimmedLength !== 11) {
          return false;
  }

  // Allow numbers, +, -, x, (, and ). Anything else renders the number
  // invalid.
  if (stripped.replace(/[^\d\+x)( \-]/g, "") === stripped)
      return true;

  return false; 
};
