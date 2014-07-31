if(console.debug == undefined) console.debug = console.log;

jsdom = require('jsdom');
fs = require('fs');
require('json');

window 	= jsdom.jsdom().createWindow();

$ = require('jQuery');

var maps = [
  {'path': '../app/assets/images/ssh_floor_0.svg', 'id': 'floor0'},
  {'path': '../app/assets/images/ssh_floor_1.svg', 'id': 'floor1'},
  {'path': '../app/assets/images/ssh_floor_2.svg', 'id': 'floor2'},
  {'path': '../app/assets/images/ssh_floor_3.svg', 'id': 'floor3'},
  {'path': '../app/assets/images/ssh_floor_4.svg', 'id': 'floor4'},
  {'path': '../app/assets/images/ssh_floor_5.svg', 'id': 'floor5'}
];

require('../app/assets/javascripts/wayfinding.datastore.js');

getRooms = function(maps) {
  var rooms = [];

  $.each(maps, function (i, map) {
    $('#Doors line', map.el).each(function () {
      var doorId = $(this).attr('id');

      // cleanupSVG does this but it might not be called at this point.
      // Ensure IDs do not have Illustrator '_' junk
      if (doorId && doorId.indexOf('_') > 0) {
        var oldID = doorId;
        doorId = oldID.slice(0, oldID.indexOf('_'));
      }

      rooms.push(doorId);
    });
  });

  return(rooms);
}

var processed = 0;
var rooms = [];

console.debug("Loading SVGs ...");

// Load SVGs
$.each(maps, function (i, map) {
  var svgDiv = $('<div id="' + map.id + '"><\/div>');

  fs.readFile(map.path, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    maps[i].svgHandle = data;
    maps[i].el = svgDiv;

    svgDiv.append(data);

    processed = processed + 1;

    if(processed == maps.length) {
      rooms = getRooms(maps);

      $.each(rooms, function(i, startpoint) {
        dataStore = null;

        console.debug("Building dataStore for " + startpoint + " (" + (i + 1) + " of " + rooms.length + ")...");

        dataStore = WayfindingDataStore.build(startpoint, maps);

        fs.writeFileSync('dataStore-' + startpoint + '.json', JSON.stringify(dataStore));
      });
    }
  });
});
