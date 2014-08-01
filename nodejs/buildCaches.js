if(console.debug == undefined) console.debug = console.log;

var jsdom = require('jsdom');
var fs = require('fs');
require('json');
var md5 = require('MD5');

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

    maps[i].md5 = md5(data);

    svgDiv.append(data);

    processed = processed + 1;

    if(processed == maps.length) {
      var rooms = WayfindingDataStore.getRooms(maps);

      // Compute a shared MD5 sum for all maps
      var shared_md5 = "";
      for(i = 0; i < maps.length; i++) {
        shared_md5 = shared_md5 + maps[i].md5;
      }
      shared_md5 = md5(shared_md5);

      $.each(rooms, function(i, startpoint) {
        var dsFilename = "dataStore-" + startpoint + "-" + shared_md5 + ".json";

        fs.exists(dsFilename, function(exists) {
          if (exists) {
            console.debug("Skipping " + shared_md5 + " dataStore for " + startpoint + " (" + (i + 1) + " of " + rooms.length + "), already exists.");
          } else {
            var dataStore = null;

            console.debug("Building " + shared_md5 + " dataStore for " + startpoint + " (" + (i + 1) + " of " + rooms.length + ")...");

            dataStore = WayfindingDataStore.build(startpoint, maps);

            fs.writeFileSync(dsFilename, JSON.stringify(dataStore));
          }
        });
      });
    }
  });
});
