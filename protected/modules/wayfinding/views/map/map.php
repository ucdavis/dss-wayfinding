<?php
/* @var $this DefaultController */
?>
<div id="mapLoading">
	<?php
		echo CHtml::image(Yii::App()->request->baseUrl . '/images/loading.gif');
	?>
</div>
<div id="floorPicker" style="display: none" class="secondaryNav">
	<div id="box">
	<select>
		<?php
			foreach($maps as $id => $map) {
				if (isset($defaultMap) && $id==$defaultMap) {
					echo "<option value='$id' selected>" . $map['name'] . "</option>";
				} else {
					echo "<option value='$id'>" . $map['name'] . "</option>";
				}
			}
		?>
	</select>
	<?php
		echo CHtml::image(Yii::App()->request->baseUrl . '/images/DownTriangle.svg',
			'Expand Dropdown',
			array(
				'id' => 'dropdown-button'
			)
		);
	?>
	</div>
</div>
<div id="wfAccessibility">
	<a style='display: none'>
	<?php
		echo CHtml::image(Yii::App()->request->baseUrl . '/images/accessibility.svg',
			'Accessible Route', array('style' => 'display: none'));
	?>
	</a>
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
			if (isset($endpoint)) echo "'endpoint': '$endpoint', ";
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

	$(document).ready(function() {
		$('#floorPicker').on('change', 'select', function(obj) {
			$('#myMaps').wayfinding('currentMap', $(this).val());
		});

		$('#myMaps').on('wfFloorChange', function() {
			var visible_map = $('div:visible', this).attr('id');
			console.log(visible_map);
			$('#floorPicker select').val(visible_map);
		});

		$('#wfAccessibility').on('click', 'a', function() {
			$('#wfAccessibility a').toggleClass('selected');
			//toggle accessibleRoute
			$('#myMaps').wayfinding('accessibleRoute',
				!$('#myMaps').wayfinding('accessibleRoute'));
		});
	});

	$('#myMaps').on('wfMapsVisible', function() {
		$('#floorPicker').show();
		$('#wfAccessibility img, #wfAccessibility a').show();
	});
</script>
