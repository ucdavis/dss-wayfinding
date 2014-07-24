function setRedirectToHome() {
  // Cancel any previous timer
  clearTimeout(document.timer);
  // Redirect after 3 minutes if @origin is set (Kiosk mode)
  document.timer = setTimeout(function(){
    if (document.origin != '')
      window.location = "/";
  }, 180000);
}
