var jsdom = require('jsdom');
var fs = require('fs-extra');
require('json');
var md5 = require('MD5');

window 	= jsdom.jsdom().defaultView;

$ = require('jquery');

var maps = [
  {'path': 'public/maps.tmp/floor0.svg', 'id': 'floor0'},
  {'path': 'public/maps.tmp/floor1.svg', 'id': 'floor1'},
  {'path': 'public/maps.tmp/floor2.svg', 'id': 'floor2'},
  {'path': 'public/maps.tmp/floor3.svg', 'id': 'floor3'},
  {'path': 'public/maps.tmp/floor4.svg', 'id': 'floor4'},
  {'path': 'public/maps.tmp/floor5.svg', 'id': 'floor5'}
];

require('../app/assets/javascripts/wayfinding.datastore.js');

// Number of maps processed
var processed = 0;
var rooms = [];
var stats = {};

var buildDataStores = function(shared_md5) {
  stats['MD5'] = shared_md5;

  $.each(rooms, function(i, startpoint) {
    var dsFilename = "dataStore-" + startpoint + ".json";

    fs.exists("public/dataStore.tmp/" + dsFilename, function(exists) {
      if (exists) {
        console.log("buildDataStores: Skipping dataStore for " + dsFilename + " (" + (i + 1) + " of " + rooms.length + "), already exists.");
      } else {
        var dataStore = null;

        console.log("buildDataStores: Building dataStore for " + dsFilename + " (" + (i + 1) + " of " + rooms.length + ")...");

        dataStore = WayfindingDataStore.build(startpoint, maps, false);

        fs.writeFileSync("public/dataStore.tmp/" + dsFilename, JSON.stringify(dataStore));
      }
    });

    var dsFilenameAccessible = "dataStore-accessible-" + startpoint + ".json";

    fs.exists("public/dataStore.tmp/" + dsFilenameAccessible, function(exists) {
      if (exists) {
        console.log("buildDataStores: Skipping dataStore for " + dsFilenameAccessible + " (" + (i + 1) + " of " + rooms.length + "), already exists.");
      } else {
        var dataStore = null;

        console.log("buildDataStores: Building dataStore for " + dsFilenameAccessible + " (" + (i + 1) + " of " + rooms.length + ")...");

        dataStore = WayfindingDataStore.build(startpoint, maps, true);

        fs.writeFileSync("public/dataStore.tmp/" + dsFilenameAccessible, JSON.stringify(dataStore));
      }

      // Update build progress once all rooms are completed
      if ((i + 1) == rooms.length) {
        stats['progress'] = "Completed";
        stats['finishTime'] = new Date();

        // Calculate total time in minutes
        stats['totalTime'] = Math.round((stats['finishTime'].getTime() - stats['startTime'].getTime()) / 60000) + " Minutes";
      } else {
        // Update progress percentage
        stats['progress'] = Math.round(100 * (i + 1) / rooms.length) + "%";
      }

      fs.writeFileSync("public/map_stats.json", JSON.stringify( stats ));
    });
  });
}

var prepareData = function() {
  processed = processed + 1;

  if(processed == maps.length) {
    stats['startTime'] = new Date();
    console.log("Start time: " + stats['startTime']);

    rooms = WayfindingDataStore.getRooms(maps);

    // Compute a shared MD5 sum for all maps
    var shared_md5 = "";
    $.each(maps, function (j, map) {
      shared_md5 = shared_md5 + map.md5;
    });
    shared_md5 = md5(shared_md5);

    // Check if a rebuild is necessary
    fs.readFile("public/map_stats.json", 'utf8', function(err, data) {
      if (err) {
        console.log("Could not find public/map_stats.json. Can continue anyway ...", err);
      } else {
        var stats = JSON.parse( data );
      }

      if ( typeof stats != "undefined" && stats.MD5 == shared_md5 && stats.progress == "Completed" ) {
        console.log("Caches are already up to date. No additional action will be taken.");
      } else {
        console.log("Starting build ...");
        buildDataStores(shared_md5);
      }
    });
  }
}

console.log("Loading SVGs ...");

// Load SVGs
$.each(maps, function (i, map) {
  var svgDiv = $('<div id="' + map.id + '"><\/div>');

  fs.readFile(map.path, 'utf8', function (err, data) {
    if (err) {
      console.log("Could not load " + map.path,err);
    }

    maps[i].svgHandle = data;
    maps[i].el = svgDiv;
    svgDiv.append(data);

    maps[i].md5 = md5(data);

    prepareData();
  });
});
