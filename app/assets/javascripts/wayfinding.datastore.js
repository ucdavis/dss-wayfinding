/*jslint devel: true, browser: true, windows: true, plusplus: true, maxerr: 50, indent: 4 */

/**
 * @preserve
 * Wayfinding Datastore v0.4.0
 * https://github.com/ucdavis/wayfinding
 *
 * Copyright (c) 2010-2014 University of California Regents
 * Licensed under GNU General Public License v2
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 *
 * Date: 2014-12-02
 *
 * The purpose of separating these functions from jquery.wayfinding.js
 * is to allow their reuse in situations where a DOM is not present such
 * as in NodeJS cache building / analysis scripts.
 *
 */

//  <![CDATA[

WayfindingDataStore = {
  dataStore: null,
  portalSegments: [],
  accessible: false,
  idToIndex: {},
  queue: null,

  // Needs to be here in WayfindingDataStore and not in jQuery.Wayfinding as it
  // can be used by NodeJS scripts to clean up rooms and generate routes as well.
  cleanupSVG: function (el) {
  	// clean up after illustrator -> svg issues
  	$('#Rooms a, #Doors line', el).each(function () {
  		if ($(this).prop('id') && $(this).prop('id').indexOf('_') > 0) {
  			var oldID = $(this).prop('id');
  			$(this).prop('id', oldID.slice(0, oldID.indexOf('_')));
  		}
  	});
  }, // function cleanupSVG

  // Orders points based on x, y, and ID in that order.
  comparePoints: function (pointA, pointB) {
     if (pointA.x !== pointB.x) {
         return pointA.x - pointB.x;
     }
     else if (pointA.y !== pointB.y) {
         return pointA.y - pointB.y;
     }
     else {
         return pointA.id - pointB.id;
     }
  },

  buildDoors: function (floor, map) {
      WayfindingDataStore.dataStore.doors[floor] = [];

      $('#Doors line', map).each(function () { // index, line
          var door = {};

          door.floor = floor;
          door.x1 = parseInt($(this).attr('x1'));
          door.x1Float = parseFloat($(this).attr('x1'));
          door.y1 = parseInt($(this).attr('y1'));
          door.y1Float = parseFloat($(this).attr('y1'));
          door.x2 = parseInt($(this).attr('x2'));
          door.x2Float = parseFloat($(this).attr('x2'));
          door.y2 = parseInt($(this).attr('y2'));
          door.y2Float = parseFloat($(this).attr('y2'));
          door.doorId = $(this).attr('id').split('_')[0];
          door.id = WayfindingDataStore.dataStore.doors[floor].length;
          //door.length = Math.sqrt(Math.pow(door.x2Float - door.x1Float, 2) + Math.pow(door.y2Float - door.y1Float, 2));

          door.paths = [];
          door.doors = [];
          door.portals = [];

          WayfindingDataStore.dataStore.doors[floor].push(door);
          WayfindingDataStore.queue.queue({
              x: door.x1,
              y: door.y1,
              id: WayfindingDataStore.dataStore.doors[floor].length - 1,
              type: 'doors'
          });
          WayfindingDataStore.queue.queue({
              x: door.x2,
              y: door.y2,
              id: WayfindingDataStore.dataStore.doors[floor].length - 1,
              type: 'doors'
          });
      });
  },

  buildPaths: function (floor, map) {
      WayfindingDataStore.dataStore.paths[floor] = [];

      $('#Paths line', map).each(function () {
          var path = {};

          path.floor = floor;
          path.x1 = parseInt($(this).attr('x1'));
          path.x1Float = parseFloat($(this).attr('x1'));
          path.y1 = parseInt($(this).attr('y1'));
          path.y1Float = parseFloat($(this).attr('y1'));
          path.x2 = parseInt($(this).attr('x2'));
          path.x2Float = parseFloat($(this).attr('x2'));
          path.y2 = parseInt($(this).attr('y2'));
          path.y2Float = parseFloat($(this).attr('y2'));
          path.length = Math.sqrt(Math.pow(path.x2Float - path.x1Float, 2) + Math.pow(path.y2Float - path.y1Float, 2));
          path.pathId = WayfindingDataStore.dataStore.paths[floor].length;
          path.id = WayfindingDataStore.dataStore.paths[floor].length;

          path.paths = [];
          path.doors = [];
          path.portals = [];

          WayfindingDataStore.dataStore.paths[floor].push(path);
          WayfindingDataStore.queue.queue({
              x: path.x1,
              y: path.y1,
              id: WayfindingDataStore.dataStore.paths[floor].length - 1,
              type: 'paths'
          });
          WayfindingDataStore.queue.queue({
              x: path.x2,
              y: path.y2,
              id: WayfindingDataStore.dataStore.paths[floor].length - 1,
              type: 'paths'
          });
      });
  },

  buildPortals: function (floor, map) {
      WayfindingDataStore.dataStore.portals[floor] = [];

      $('#Portals line', map).each(function () { // index, line
          var portal = {};

          portal.floor = floor;
          portal.x1 = parseInt($(this).attr('x1'));
          portal.x1Float = parseFloat($(this).attr('x1'));
          portal.y1 = parseInt($(this).attr('y1'));
          portal.y1Float = parseFloat($(this).attr('y1'));
          portal.x2 = parseInt($(this).attr('x2'));
          portal.x2Float = parseFloat($(this).attr('x2'));
          portal.y2 = parseInt($(this).attr('y2'));
          portal.y2Float = parseFloat($(this).attr('y2'));

          portal.paths = [];
          portal.doors = [];
          portal.portals = [];
          portal.id = WayfindingDataStore.dataStore.portals[floor].length;

          var portalID = $(this).attr('id').split('_')[0].split('.');

          portal.portalId = portalID[0] + '.' + portalID[1];

          var toFloor = WayfindingDataStore.idToIndex[portalID[2]];
          if (toFloor === undefined) {
              toFloor = -1;
          }

          portal.toFloor = parseInt(toFloor);
          portal.accessible = false;
          portal.match = -1;

          if (portalID[0] === 'Elev') {
              portal.accessible = true;
          }

          portal.length = Math.sqrt(Math.pow(portal.x2Float - portal.x1Float, 2) + Math.pow(portal.y2Float - portal.y1Float, 2));

          WayfindingDataStore.dataStore.portals[floor].push(portal);
          WayfindingDataStore.queue.queue({
              x: portal.x1,
              y: portal.y1,
              id: WayfindingDataStore.dataStore.portals[floor].length - 1,
              type: 'portals'
          });
          WayfindingDataStore.queue.queue({
              x: portal.x2,
              y: portal.y2,
              id: WayfindingDataStore.dataStore.portals[floor].length - 1,
              type: 'portals'
          });
      });
  },  // buildPortals

  buildConnections: function (floor) {
      if (WayfindingDataStore.queue.length === 0 ) {
          return;
      }

      var start = WayfindingDataStore.queue.dequeue();
      var connected = [start];
      var previous = start;

      function connectLines(connectedLines, floorNumber)
      {
          $.each(connectedLines, function(i, firstPath) {
              $.each(connectedLines, function(j, secondPath) {
                  if (i !== j) {
                      WayfindingDataStore.dataStore[firstPath.type][floorNumber][firstPath.id][secondPath.type].push(secondPath.id);
                  }
              });
          });
      }

      while(WayfindingDataStore.queue.length > 0) {
          var point = WayfindingDataStore.queue.dequeue();

          if (previous.x === point.x && previous.y === point.y) {
              connected.push(point);
          }
          else {
              connectLines(connected, floor);
              connected = [point];
          }
          previous = point;
      }

      connectLines(connected, floor);
  },

  matchPortals: function () {
      // Go through each portal
      $.each(WayfindingDataStore.dataStore.portals, function(floor, floorPortals) {
        $.each(floorPortals, function(i, portal) {

          if (portal.match === -1) {
            // For each portal, go through linked floor portals
            // -1 indicates that the other floor does not exist
            if (portal.toFloor !== -1) {
              $.each(WayfindingDataStore.dataStore.portals[portal.toFloor], function(j, portal2) {
                  if (portal2.portalId === portal.portalId &&
                      portal2.toFloor === portal.floor)
                  {
                    portal.match = portal2.id;
                    portal2.match = portal.id;
                  }
              });
            }
          }
        });
      });
  },

  buildDatastore: function(maps) {
      WayfindingDataStore.dataStore = {
          'doors': [],
          'paths': [],
          'portals': []
      };

      // Build the dataStore from each map given
      $.each(maps, function(i, map) {
          WayfindingDataStore.queue = new PriorityQueue({ comparator: WayfindingDataStore.comparePoints });
          WayfindingDataStore.buildDoors(i, map.el);
          WayfindingDataStore.buildPaths(i, map.el);
          WayfindingDataStore.buildPortals(i, map.el);
          WayfindingDataStore.buildConnections(i);
      });

      WayfindingDataStore.matchPortals();

      return WayfindingDataStore.dataStore;
  }, // function buildDatastore

  build: function (maps, idToIndex) {
    WayfindingDataStore.idToIndex = idToIndex;
    return WayfindingDataStore.buildDatastore(maps);
  }
}

//  ]]>
