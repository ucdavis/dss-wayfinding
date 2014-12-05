if(console.debug == undefined) console.debug = console.log;

var jsdom = require('jsdom');
var fs = require('fs-extra');
require('json');
var md5 = require('MD5');
var ncp = require('ncp').ncp;

window 	= jsdom.jsdom().defaultView;

$ = require('jquery');

var oldMaps = [
  {'path': 'public/maps/floor0.svg', 'id': 'floor0'},
  {'path': 'public/maps/floor1.svg', 'id': 'floor1'},
  {'path': 'public/maps/floor2.svg', 'id': 'floor2'},
  {'path': 'public/maps/floor3.svg', 'id': 'floor3'},
  {'path': 'public/maps/floor4.svg', 'id': 'floor4'},
  {'path': 'public/maps/floor5.svg', 'id': 'floor5'}
];
var maps = [
  {'path': 'public/maps.tmp/floor0.svg', 'id': 'floor0'},
  {'path': 'public/maps.tmp/floor1.svg', 'id': 'floor1'},
  {'path': 'public/maps.tmp/floor2.svg', 'id': 'floor2'},
  {'path': 'public/maps.tmp/floor3.svg', 'id': 'floor3'},
  {'path': 'public/maps.tmp/floor4.svg', 'id': 'floor4'},
  {'path': 'public/maps.tmp/floor5.svg', 'id': 'floor5'}
];

require('../app/assets/javascripts/wayfinding.datastore.js');

var processed = 0;
var rooms = [];
var stats = {};

var buildDataStores = function (shared_md5) {
  stats['MD5'] = shared_md5;

  console.log("buildDataStores: Rooms.length = " + rooms.length);

  $.each(rooms, function(i, startpoint) {
    var dsFilename = "dataStore-" + startpoint + ".json";

    fs.exists("public/dataStore/" + shared_md5 + "/" + dsFilename, function(exists) {
      if (exists) {
        console.debug("buildDataStores: Skipping " + shared_md5 + " dataStore for " + dsFilename + " (" + (i + 1) + " of " + rooms.length + "), already exists.");
      } else {
        var dataStore = null;

        console.debug("buildDataStores: Building " + shared_md5 + " dataStore for " + dsFilename + " (" + (i + 1) + " of " + rooms.length + ")...");

        dataStore = WayfindingDataStore.build(startpoint, maps, false);

        fs.writeFileSync("public/dataStore/" + shared_md5 + "/" + dsFilename, JSON.stringify(dataStore));
      }
    });

    var dsFilenameAccessible = "dataStore-accessible-" + startpoint + ".json";

    fs.exists("public/dataStore/" + shared_md5 + "/" + dsFilenameAccessible, function(exists) {
      if (exists) {
        console.debug("buildDataStores: Skipping " + shared_md5 + " dataStore for " + dsFilenameAccessible + " (" + (i + 1) + " of " + rooms.length + "), already exists.");
      } else {
        var dataStore = null;

        console.debug("buildDataStores: Building " + shared_md5 + " dataStore for " + dsFilenameAccessible + " (" + (i + 1) + " of " + rooms.length + ")...");

        dataStore = WayfindingDataStore.build(startpoint, maps, true);

        fs.writeFileSync("public/dataStore/" + shared_md5 + "/" + dsFilenameAccessible, JSON.stringify(dataStore));
      }

      console.log("buildDataStores: i = " + i);

      if ((i + 1) == rooms.length) {
        // Update build progress once all rooms are acompleted
        stats['progress'] = "Completed";
        stats['finishTime'] = new Date();
        // Total Time in minutes
        stats['totalTime'] = Math.round((stats['finishTime'].getTime() - stats['startTime'].getTime()) / 60000) + " Minutes";

        // Move caches to proper location
        ncp('public/dataStore/' + shared_md5, 'public/dataStore', function(err) {
          if (err) return console.error("Error copying dataStore files: " + err);
          fs.removeSync('public/dataStore/' + shared_md5);
          console.log("buildDataStores: Moved cache files to /public/dataStore");
        });

        // Move uploaded map files
        ncp('public/maps.tmp', 'public/maps', function(err) {
          if (err) return console.error("Error copying map files: " + err);
          fs.removeSync('public/maps.tmp/');
          console.log("buildDataStores: Moved maps to /public/maps");
        });
      } else {
        // Update progress percentage
        stats['progress'] = Math.round(100 * (i + 1) / rooms.length) + "%";
      }

      fs.writeFileSync("public/dataStore/stats.json", JSON.stringify( stats ));
    });
  });
}

// Credit: http://stackoverflow.com/questions/11293857/fastest-way-to-copy-file-in-node-js
// We used this because fs.copy and fs.copySync both had issues (not copying or 0 file size at times)
var copyFile = function(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

var copyNonExistingMaps = function() {
  fs.mkdir("public/maps", '0755', function(err) {
    if (err && (err.code != 'EEXIST')) {
      console.log("copyNonExistingMaps: Failed to create directory 'public/maps'.\n" + err);
    } else {
      $.each(oldMaps, function (i, map) {
        console.log("copyNonExistingMaps: Checking if map " + i + " exists. old: " + oldMaps[i].path + ", New: " + maps[i].path);
        fs.exists(oldMaps[i].path, function(exists) {
          console.log("copyNonExistingMaps: Map exists?: " + exists);
          if (!exists) {
            // Copy map if does not exist
            try {
              copyFile(maps[i].path, oldMaps[i].path, function(err) {
                if (err) {
                  console.log("copyNonExistingMaps: Error copying new map from " + maps[i].path + " to " + oldMaps[i].path + ". Error: " + err);
                  return;
                }
                console.log("copyNonExistingMaps: Copied new map " + i + " to /public/maps");
              });
            } catch(e) {
              console.log("copyNonExistingMaps: Exception during copySync:");
              console.log(e);
            }
          }
        });
      });
    }
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

    // Ensures dataStore directory exists
    fs.mkdir("public/dataStore", '0755', function(err) {
      if (err && (err.code != 'EEXIST')) {
        console.log("Failed to create directory 'public/dataStore'. Aborting ... \n" + err);
        process.exit(-1);
      }
    });
    fs.mkdir("public/dataStore/" + shared_md5, '0755', function(err) {
      if (err && (err.code != 'EEXIST')) {
        console.log("Failed to create directory 'public/dataStore/" + shared_md5 + "'. Aborting ...\n" + err);
        process.exit(-1);
      }
    });

    // Check if a rebuild is necessary
    fs.readFile("public/dataStore/stats.json", 'utf8', function(err, data) {
      if (err) {
        console.log("Could not find public/dataStore/stats.json. Can continue anyway ...", err);
      } else {
        var stats = JSON.parse( data );
      }

      if ( typeof stats != "undefined" && stats.MD5 == shared_md5 && stats.progress == "Completed" ) {
        console.log("Caches are already up to date. No additional action will be taken.");
      } else {
        console.log("Starting build ...");
        copyNonExistingMaps();
        buildDataStores(shared_md5);
      }
    });

  }

}

console.debug("Loading SVGs ...");

// Load SVGs
$.each(maps, function (i, map) {
  var svgDiv = $('<div id="' + map.id + '"><\/div>');

  fs.readFile(map.path, 'utf8', function (err, data) {
    if (err) {
      // Removed the return statement, because admins may not upload all maps
      console.log("Could not load " + map.path,err);

      // Push the corresponding old map to the maps array for the
      // WayfindingDataStore.build if no new map was uploaded
      fs.readFile(oldMaps[i].path, 'utf8', function (err, data) {
        if (err) console.log("Could not load " + oldMaps[i].path,err);

        maps[i].path = oldMaps[i].path;
        maps[i].svgHandle = data;
        maps[i].el = svgDiv;
        svgDiv.append(data);

        maps[i].md5 = md5(data);

        prepareData();
      });

    } else {

      maps[i].svgHandle = data;
      maps[i].el = svgDiv;
      svgDiv.append(data);

      maps[i].md5 = md5(data);

      prepareData();
    }

  });
});
