module DirectoryObjectsHelper
  def wayfinding_plugin(svg_paths, dataStoreCacheUrl, accessibleDataStoreCacheUrl, origin, dest = nil)
    dest = '\'' + dest + '\'' unless dest.nil?
    str = "$('#map').wayfinding({
    'maps': ["

    svg_paths.each_with_index do |svg, i|
      str = str + "{'path': '" + svg + "', 'id': 'floor" + i.to_s + "'}"

      if i != svg_paths.length
        str = str + ","
      end
    end

    str = str + "],
    'dataStoreCache': '" + dataStoreCacheUrl + "',
    'accessibleDataStoreCache': '" + accessibleDataStoreCacheUrl + "',
    'path': {
      width: 3,
      color: 'rgb(194, 110, 96)',
      radius: 8,
      speed: 20
    },
    'startpoint': function () {
      console.debug('Start location is ' + '" + origin + "');
      return '" + origin + "';
    },
    'endpoint': " + (dest || 'false') + ",
    'locationIndicator' : {
      height: 30
    },
    'pinchToZoom' : true,
    'showLocation' : true,
    'defaultMap': 'floor" + origin[1,1] + "'
  });
  "

    unless dest.nil?
        str += "$('#map').trigger('wayfinding:roomClicked',
                    [ { room_id: " + dest + " } ] );"
    end

    return str.html_safe
  end
end
