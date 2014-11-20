if(console.debug == undefined) console.debug = console.log;

var jsdom = require('jsdom');
var fs = require('fs-extra');
require('json');
var md5 = require('MD5');

window 	= jsdom.jsdom().createWindow();

$ = require('jquery');

var maps = [
  {'path': '../public/maps.tmp/floor0.svg', 'id': 'floor0'},
  {'path': '../public/maps.tmp/floor1.svg', 'id': 'floor1'},
  {'path': '../public/maps.tmp/floor2.svg', 'id': 'floor2'},
  {'path': '../public/maps.tmp/floor3.svg', 'id': 'floor3'},
  {'path': '../public/maps.tmp/floor4.svg', 'id': 'floor4'},
  {'path': '../public/maps.tmp/floor5.svg', 'id': 'floor5'}
];

require('../app/assets/javascripts/wayfinding.datastore.js');

var processed = 0;
var rooms = [];
var stats = {};

var buildDataStores = function (shared_md5) {
  $.each(rooms, function(i, startpoint) {
    var dsFilename = "dataStore-" + startpoint + ".json";

    fs.exists("../public/dataStore/" + shared_md5 + "/" + dsFilename, function(exists) {
      if (exists) {
        console.debug("Skipping " + shared_md5 + " dataStore for " + dsFilename + " (" + (i + 1) + " of " + rooms.length + "), already exists.");
      } else {
        var dataStore = null;

        console.debug("Building " + shared_md5 + " dataStore for " + dsFilename + " (" + (i + 1) + " of " + rooms.length + ")...");

        dataStore = WayfindingDataStore.build(startpoint, maps, false);

        fs.writeFileSync("../public/dataStore/" + shared_md5 + "/" + dsFilename, JSON.stringify(dataStore));
      }
    });

    var dsFilenameAccessible = "dataStore-accessible-" + startpoint + ".json";

    fs.exists("../public/dataStore/" + shared_md5 + "/" + dsFilenameAccessible, function(exists) {
      if (exists) {
        console.debug("Skipping " + shared_md5 + " dataStore for " + dsFilenameAccessible + " (" + (i + 1) + " of " + rooms.length + "), already exists.");
      } else {
        var dataStore = null;

        console.debug("Building " + shared_md5 + " dataStore for " + dsFilenameAccessible + " (" + (i + 1) + " of " + rooms.length + ")...");

        dataStore = WayfindingDataStore.build(startpoint, maps, true);

        fs.writeFileSync("../public/dataStore/" + shared_md5 + "/" + dsFilenameAccessible, JSON.stringify(dataStore));
      }


      if ((i+1) == rooms.length) {
        // Update build progress once all rooms are acompleted
        stats['progress'] = "Completed";
        stats['finishTime'] = new Date();
        // Total Time in minutes
        stats['totalTime'] = Math.round((stats['finishTime'].getTime() - stats['startTime'].getTime()) / 60000) + " Minutes";

        // Move caches to proper location
        fs.copy('../public/dataStore/' + shared_md5, '../public/dataStore', function(err) {
          if (err) return console.error("Error copying dataStore files: " + err);
          fs.removeSync('../public/dataStore/' + shared_md5);
          console.log("Moved cache files to /public/dataStore");
        });

        // Move uploaded map files
        fs.copy('../public/maps.tmp', '../public/maps', function(err) {
          if (err) return console.error("Error copying map files: " + err);
          fs.removeSync('../public/maps.tmp/');
          console.log("Moved maps to /public/maps");
        });

      } else {
        // Update progress percentage
        stats['progress'] = Math.round(100*(i+1)/rooms.length) + "%";
      }

      fs.writeFileSync("../public/dataStore/stats.json", JSON.stringify( stats ));

    });


  });
}


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
      stats['startTime'] = new Date();
      console.log("Start time: " + stats['startTime']);

      rooms = WayfindingDataStore.getRooms(maps);

      // Compute a shared MD5 sum for all maps
      var shared_md5 = "";
      for(i = 0; i < maps.length; i++) {
        shared_md5 = shared_md5 + maps[i].md5;
      }
      shared_md5 = md5(shared_md5);

      // Ensures shared_md5 directory exists
      fs.mkdir("../public/dataStore", '0777', function(err) {
        if (err && (err.code != 'EEXIST')) {
          console.log("Failed to create directory '../public/dataStore'. Aborting ...");
          process.exit(-1);
        }
      });
      fs.mkdir("../public/dataStore/" + shared_md5, '0777', function(err) {
        if (err && (err.code != 'EEXIST')) {
          console.log("Failed to create directory '../public/dataStore/'" + shared_md5 + ". Aborting ...");
          process.exit(-1);
        }
      });

      // Check if a rebuild is necessary
      fs.exists("../public/dataStore/" + shared_md5 + ".md5", function(md5Exists) {
        if (md5Exists) {
          fs.readFile("../public/dataStore/stats.json", 'utf8', function(err,data) {
            if (err) {
              return console.log(err);
            }
            var stats = JSON.parse( data );
            if ( stats.progress == "Completed") {
              console.log("Caches are already up to date.");
            } else {
              buildDataStores(shared_md5);
            }
          });
        } else {
          fs.writeFileSync("../public/dataStore/" + shared_md5 + ".md5", "");
          buildDataStores(shared_md5);
        }
      });

    }
  });
});
