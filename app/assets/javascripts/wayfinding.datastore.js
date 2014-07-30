WayfindingDataStore = {
  dataStore: {
    'paths': [],
    'portals': []
  },
  portalSegments: [],

  cleanupSVG: function (el) {
  	// clean up after illustrator -> svg issues
  	$('#Rooms a, #Doors line', el).each(function () {
  		if ($(this).prop('id') && $(this).prop('id').indexOf('_') > 0) {
  			var oldID = $(this).prop('id');
  			$(this).prop('id', oldID.slice(0, oldID.indexOf('_')));
  		}
  	});
  }, //function cleanupSVG

  // Extract data from the svg maps
  processMap: function (mapNum, map, el) {

  	window.wayfindingDataStore = WayfindingDataStore.dataStore;

  	var path,
  		doorId,
  		x1,
  		y1,
  		x2,
  		y2,
  		matches,
  		portal,
  		portalId;

  	//Paths

  	WayfindingDataStore.dataStore.paths[mapNum] = [];

  	$('#Paths line', el).each(function () { // index, line

  		path = {};
  		path.floor = map.id; // floor_1
  		path.mapNum = mapNum; // index of floor in array 1
  		path.route = Infinity; //Distance
  		path.prior = -1; //Prior node in path that yielded route distance
  		path.ax = $(this).prop('x1').animVal.value;
  		path.ay = $(this).prop('y1').animVal.value;
  		path.doorA = [];
  		path.bx = $(this).prop('x2').animVal.value;
  		path.by = $(this).prop('y2').animVal.value;
  		path.doorB = [];
  		path.length = Math.sqrt(Math.pow(path.ax - path.bx, 2) + Math.pow(path.ay - path.by, 2));

  		path.connections = []; //other paths
  		path.portals = []; // connected portals

  		WayfindingDataStore.dataStore.paths[mapNum].push(path);

  	});

  	//Doors and starting points
  	//roomId or POI_Id

  	$('#Doors line', el).each(function () { // index, line

  		x1 = $(this).prop('x1').animVal.value;
  		y1 = $(this).prop('y1').animVal.value;
  		x2 = $(this).prop('x2').animVal.value;
  		y2 = $(this).prop('y2').animVal.value;
  		doorId = $(this).prop('id');

  		$.each(WayfindingDataStore.dataStore.paths[mapNum], function (index, path) {
  			if (map.id === path.floor && ((path.ax === x1 && path.ay === y1) || (path.ax === x2 && path.ay === y2))) {
  				path.doorA.push(doorId);
  			} else if (map.id === path.floor && ((path.bx === x1 && path.by === y1) || (path.bx === x2 && path.by === y2))) {
  				path.doorB.push(doorId);
  			}
  		});

  	});

  	//Portal Segments -- string theory says unmatched portal segment useless -- no wormhole

  	$('#Portals line', el).each(function () { // index, line
  		portal = {};

  		portalId = $(this).prop('id');

  		if (portalId && portalId.indexOf('_') > -1) {
  			portalId = portalId.slice(0, portalId.indexOf('_'));
  		}

  		portal.id = portalId;
  		portal.type = portalId.split('.')[0];
  		portal.floor = map.id;

  		portal.mate = portalId.split('.').slice(0, 2).join('.') + '.' + map.id;

  		portal.mapNum = mapNum;

  		portal.matched = false;

  		x1 = $(this).prop('x1').animVal.value;
  		y1 = $(this).prop('y1').animVal.value;
  		x2 = $(this).prop('x2').animVal.value;
  		y2 = $(this).prop('y2').animVal.value;

  		matches = $.grep(WayfindingDataStore.dataStore.paths[mapNum], function (n) { // , i
  			return ((x1 === n.ax && y1 === n.ay) || (x1 === n.bx && y1 === n.by));
  		});

  		if (matches.length !== 0) {
  			portal.x = x1;
  			portal.y = y1;
  		} else {
  			portal.x = x2;
  			portal.y = y2;
  		}

  		//portal needs length -- long stairs versus elevator
  		portal.length = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

  		WayfindingDataStore.portalSegments.push(portal);

  	});
  }, // function finishfloor

	// after data extracted from all svg maps then build portals between them
	buildPortals: function () {

		var segmentOuterNum,
			segmentInnerNum,
			outerSegment,
			innerSegment,
			portal,
			mapNum,
			pathOuterNum,
			pathInnerNum,
			portalNum,
			pathNum;

		for (segmentOuterNum = 0; segmentOuterNum < portalSegments.length; segmentOuterNum++) {

			outerSegment = portalSegments[segmentOuterNum];

			if (outerSegment.matched === false) {

				for (segmentInnerNum = segmentOuterNum; segmentInnerNum < portalSegments.length; segmentInnerNum++) {
					if (portalSegments[segmentInnerNum].id === outerSegment.mate && portalSegments[segmentInnerNum].mate === outerSegment.id) {
						innerSegment = portalSegments[segmentInnerNum];

						portal = {};

						outerSegment.matched = true;
						innerSegment.matched = true;

						portal.type = outerSegment.type;
						portal.accessible = (portal.type === 'Elev' || portal.type === 'Door') ? true : false; // consider changing to != Stair

						portal.idA = outerSegment.id;
						portal.floorA = outerSegment.floor;
						portal.floorANum = outerSegment.mapNum;
						portal.xA = outerSegment.x;
						portal.yA = outerSegment.y;
						portal.connectionsA = []; //only paths

						portal.idB = innerSegment.id;
						portal.floorB = innerSegment.floor;
						portal.floorBNum = innerSegment.mapNum;
						portal.xB = innerSegment.x;
						portal.yB = innerSegment.y;
						portal.connectionsB = []; // only paths

						portal.length = outerSegment.length + innerSegment.length;

						portal.route = Infinity;
						portal.prior = -1;

						WayfindingDataStore.dataStore.portals.push(portal);

					}
				}
			}
		}

		//check each path for connections to other paths
		//checks only possible matchs on same floor, and only for half-1 triangle of search area to speed up search
		for (mapNum = 0; mapNum < maps.length; mapNum++) {
			for (pathOuterNum = 0; pathOuterNum < dataStore.paths[mapNum].length - 1; pathOuterNum++) {
				for (pathInnerNum = pathOuterNum + 1; pathInnerNum < dataStore.paths[mapNum].length; pathInnerNum++) {
					if (
						(WayfindingDataStore.dataStore.paths[mapNum][pathInnerNum].ax === WayfindingDataStore.dataStore.paths[mapNum][pathOuterNum].ax &&
						WayfindingDataStore.dataStore.paths[mapNum][pathInnerNum].ay === WayfindingDataStore.dataStore.paths[mapNum][pathOuterNum].ay) ||
							(WayfindingDataStore.dataStore.paths[mapNum][pathInnerNum].bx === WayfindingDataStore.dataStore.paths[mapNum][pathOuterNum].ax &&
								WayfindingDataStore.dataStore.paths[mapNum][pathInnerNum].by === WayfindingDataStore.dataStore.paths[mapNum][pathOuterNum].ay) ||
							(WayfindingDataStore.dataStore.paths[mapNum][pathInnerNum].ax === WayfindingDataStore.dataStore.paths[mapNum][pathOuterNum].bx &&
								WayfindingDataStore.dataStore.paths[mapNum][pathInnerNum].ay === WayfindingDataStore.dataStore.paths[mapNum][pathOuterNum].by) ||
							(WayfindingDataStore.dataStore.paths[mapNum][pathInnerNum].bx === WayfindingDataStore.dataStore.paths[mapNum][pathOuterNum].bx &&
								WayfindingDataStore.dataStore.paths[mapNum][pathInnerNum].by === WayfindingDataStore.dataStore.paths[mapNum][pathOuterNum].by)
					) {
						WayfindingDataStore.dataStore.paths[mapNum][pathOuterNum].connections.push(pathInnerNum);
						WayfindingDataStore.dataStore.paths[mapNum][pathInnerNum].connections.push(pathOuterNum);
					}
				}
			}
		}

		//optimize portal searching of paths
		for (portalNum = 0; portalNum < dataStore.portals.length; portalNum++) {
			for (mapNum = 0; mapNum < maps.length; mapNum++) {
				for (pathNum = 0; pathNum < dataStore.paths[mapNum].length; pathNum++) {
					if (WayfindingDataStore.dataStore.portals[portalNum].floorA === WayfindingDataStore.dataStore.paths[mapNum][pathNum].floor &&
							((WayfindingDataStore.dataStore.portals[portalNum].xA === WayfindingDataStore.dataStore.paths[mapNum][pathNum].ax &&
								WayfindingDataStore.dataStore.portals[portalNum].yA === WayfindingDataStore.dataStore.paths[mapNum][pathNum].ay) ||
								(WayfindingDataStore.dataStore.portals[portalNum].xA === WayfindingDataStore.dataStore.paths[mapNum][pathNum].bx &&
									WayfindingDataStore.dataStore.portals[portalNum].yA === WayfindingDataStore.dataStore.paths[mapNum][pathNum].by))) {
						WayfindingDataStore.dataStore.portals[portalNum].connectionsA.push(pathNum);
						WayfindingDataStore.dataStore.paths[mapNum][pathNum].portals.push(portalNum);
					} else if (WayfindingDataStore.dataStore.portals[portalNum].floorB === WayfindingDataStore.dataStore.paths[mapNum][pathNum].floor &&
							((WayfindingDataStore.dataStore.portals[portalNum].xB === WayfindingDataStore.dataStore.paths[mapNum][pathNum].ax &&
								WayfindingDataStore.dataStore.portals[portalNum].yB === WayfindingDataStore.dataStore.paths[mapNum][pathNum].ay) ||
							(WayfindingDataStore.dataStore.portals[portalNum].xB === WayfindingDataStore.dataStore.paths[mapNum][pathNum].bx &&
								WayfindingDataStore.dataStore.portals[portalNum].yB === WayfindingDataStore.dataStore.paths[mapNum][pathNum].by))) {
						WayfindingDataStore.dataStore.portals[portalNum].connectionsB.push(pathNum);
						WayfindingDataStore.dataStore.paths[mapNum][pathNum].portals.push(portalNum);
					}
				}
			}
		}

		WayfindingDataStore.portalSegments = [];

	},   // end function buildportals

  build: function (maps) {
  	var processed = 0;
  	$.each(maps, function (i, map) {
			var targetFloor = $('<div id="' + map.id + '"><\/div>');

			//create svg in that div
			targetFloor.load(
				map.path,
				function (svg) {
					//get handle for that svg
					processed = processed + 1;
					maps[i].svgHandle = svg;
					WayfindingDataStore.cleanupSVG(targetFloor);

      		WayfindingDataStore.processMap(i, map, this);

      		if (processed === maps.length) {
      			WayfindingDataStore.buildPortals();
      		}
        }
      );
  		// rather than checking if we have processed the last map in order, this checks if we have processed the right number of maps
      
  	});
    console.log(window.wayfindingDataStore);
  } // function loadMaps
}