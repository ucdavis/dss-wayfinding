if(console.debug == undefined) console.debug = console.log;

jsdom = require('jsdom');
fs = require('fs');
require('json');

window 	= jsdom.jsdom().createWindow();

$ = require('jquery');

var maps = [
  {'path': 'public/maps/floor0.svg', 'id': 'floor0'},
  {'path': 'public/maps/floor1.svg', 'id': 'floor1'},
  {'path': 'public/maps/floor2.svg', 'id': 'floor2'},
  {'path': 'public/maps/floor3.svg', 'id': 'floor3'},
  {'path': 'public/maps/floor4.svg', 'id': 'floor4'},
  {'path': 'public/maps/floor5.svg', 'id': 'floor5'}
];

require('../app/assets/javascripts/wayfinding.datastore.js');

var processed = 0;

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
      var rooms = WayfindingDataStore.getRooms(maps);
      var randomRoom = rooms[Math.floor(Math.random() * rooms.length)];

      console.log("Rooms: " + WayfindingDataStore.countRooms(maps));
      console.log("Doors: " + WayfindingDataStore.countDoors(maps));
      console.log("Paths: " + WayfindingDataStore.countPaths(maps));

      console.log("Using randomly choosen room '" + randomRoom + "' as the starting point.");
      console.log("Be aware that the randomly choosen room could itself be disconnected from the map. Recommended to run the script a few times and only consider common results.");

      var dataStore = WayfindingDataStore.build(randomRoom, maps);

      console.log(WayfindingDataStore.checkMaps(maps, randomRoom));
    }
  });
});
