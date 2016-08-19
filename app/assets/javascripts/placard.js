//= require jquery
//= require show

// TODO: Remove hard coded number
var numberOfBackgrounds = 14; //Change when adding new images
var curBackground = 0;

/**
 * Changes the background image of placard
 * @param {int} num - index of background image
 */
function changeBgImage(num) {
  var backgrounds = document.getElementsByClassName("bgstyle");
  var newBackground;

  if(num == 0) { 	//Go to previous background
    if(curBackground == 0) {
      curBackground = numberOfBackgrounds;
    } else {
      curBackground -= 1;
    }
  }
  else {			//Go to next background
    if (curBackground == numberOfBackgrounds) {
      curBackground = 0;
    }
    else {
      curBackground += 1;
    }
  }

  for(var i = 0; i < backgrounds.length; i++) {
    // Set blank background
    if(curBackground == numberOfBackgrounds) {
      newBackground = "";
    }
    else {
      newBackground = "/assets/placard/back" + curBackground + ".jpg";
    }

    backgrounds[i].setAttribute("src", newBackground);
  }

} // function changeBgImage
