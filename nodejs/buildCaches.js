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

var dataStore = null;
var processed = 0;
var startpoint = 'R1131';

// Load SVGs off the network
$.each(maps, function (i, map) {
  var svgDiv = $('<div id="' + map.id + '"><\/div>');

  fs.readFile(map.path, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    maps[i].svgHandle = data;
    maps[i].el = svgDiv;
    console.log("Creating DOM fragment for ", map.path);
    svgDiv.append(data);

    //$(obj).append(svgDiv);

    processed = processed + 1;

    if(processed == maps.length) {
      console.log("Building dataStore ...");
      dataStore = WayfindingDataStore.build(startpoint, maps);
      console.log("Done building dataStore. Writing to disk ...");

      fs.writeFile('dataStore-' + startpoint + '.json', JSON.stringify(dataStore), function (err) {
        if (err) return console.log(err);
        console.log('Done saving.');
      });
    }
  });
});
