<?php
/* @var $this DefaultController */
?>
<div id="mapLoading">
	<?php
		echo CHtml::image(Yii::App()->request->baseUrl . '/images/loading.gif');
	?>
</div>
<div id="floorPicker" style="display: none">
	<ul>
		<?php
			foreach($maps as $id => $map) {
				if (isset($defaultMap) && $id==$defaultMap) {
					echo "<li id='$id' class='selected'>" . $map['name'] . "</li>";
				} else {
					echo "<li id='$id'>" . $map['name'] . "</li>";
				}
			}
		?>
	</ul>
</div>
<div id="myMaps"></div>
<script type="text/javascript" id="loadMaps">
	$('#myMaps').wayfinding({
		<?php
			// list of maps specified by a map filepath and client-specified id.
			echo "'maps': [\n";
			foreach($maps as $index => $map) {
				echo "{'path': '" . $map['path'] . "', 'id': '$index'},\n";
			}
			echo "], \n";
			if (isset($defaultMap)) echo "'defaultMap': '$defaultMap', ";
			// startpoint for routing purposes.
			echo "'startpoint': '$startpoint', \n";
			// endpoint for routing. If specified, the map will route on page load.
			if (isset($endpoint)) echo "'endpoint': $endpoint, ";
			// dataStoreCache: path to dataStoreCache
			if (isset($dataStoreCache)) echo "'dataStoreCache': '$dataStoreCache', ";
			//wayFound: cache has correct route data embedded.
			echo "'wayFound': " . ($wayFound ? 'true' : 'false') . ", \n";

			// variables for tweaking aesthetics.
			if (isset($showLocation))
				echo "'showLocation': " . ($showLocation ? 'true' : 'false') . ", ";
			if (isset($locationIndicator)){
				echo "'locationIndicator' : {\n";
					foreach ($locationIndicator as $key => $value) {
						echo "'$key': '$value', \n";
					}
				echo "}, \n";
			}
			if (isset($path)) {
				echo "path: { \n";
				foreach ($path as $key => $value) {
					echo "\t$key: '$value', \n";
				}
				echo "}, \n";
			}
			if (isset($zoomToRoute))
				echo "'zoomToRoute': " . ($zoomToRoute ? 'true' : 'false') . ", \n";
			if (isset($zoomPadding)) echo "'zoomPadding': $zoomPadding, \n";
			// end aesthetics.

			echo "'accessibleRoute': " . ($accessibleRoute ? 'true' : 'false') . ", ";
			// Always true. Used by scripts to update control highlighting.
			echo "'mapEvents': true";
			// $cont = ob_get_contents();
			// ob_end_clean();
		?>
	});

	$(document).ready(
		$('#floorPicker').on('click', 'li', function(obj) {
			$('#myMaps').wayfinding('currentMap', $(this).attr('id'));
		})
	);

	$(document).ready(
		$('#myMaps').on('wfFloorChange', function() {
			$('#floorPicker li').removeClass('selected');
			$('#floorPicker #' + $('div:visible', this).attr('id')).addClass('selected');
		})
	);

	$('#myMaps').on('wfMapsVisible', function() {
		$('#floorPicker').show();
		$('#navigation #accessibility').show();
	});
</script>
