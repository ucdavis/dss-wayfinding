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
      dataStore = null;

      dataStore = WayfindingDataStore.build('R1131', maps);

      console.log(WayfindingDataStore.checkMaps(maps, 'R1131'));
    }
  });
});
