module DirectoryObjectsHelper
  def wayfinding_plugin(svg_paths, dataStoreCacheUrl, origin)
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
    'path': {
      width: 3,
      color: 'rgb(194, 110, 96)',
      radius: 8,
      speed: 8
    },
    'startpoint': function () {
      console.debug('Start location is ', '" + origin + "');
      return '" + origin + "';
    },
    'defaultMap': 'floor1'
  });
  "

    return str.html_safe
  end
end
