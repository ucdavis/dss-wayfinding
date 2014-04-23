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
			echo "'maps': [\n";
			foreach($maps as $index => $map) {
				echo "{'path': '" . $map['path'] . "', 'id': '$index'},\n";
			}
			echo "],\n";
			if (isset($path)) {
				echo "path: {\n";
				foreach ($path as $key => $value) {
					echo "\t$key: '$value',\n";
				}
				echo "},\n";
			}
			echo "'startpoint': '$startpoint',\n";
			if (isset($zoomToRoute)) echo "'zoomToRoute': $zoomToRoute,\n";
			if (isset($zoomPadding)) echo "'zoomPadding': $zoomPadding,\n";
			if (isset($wayFound)) echo "'wayFound': $wayFound,\n";
			if (isset($locationIndicator)){
				echo "'locationIndicator' : {\n";
					foreach ($locationIndicator as $key => $value) {
						echo "'$key': '$value',\n";
					}
				echo "},\n";
			}
			if (isset($defaultMap)) echo "'defaultMap': '$defaultMap',";
			if (isset($endpoint)) echo "'endpoint': $endpoint,";
			if (isset($showLocation)) echo "'showLocation': $showLocation,";
			echo "'accessibleRoute': $accessibleRoute,";
			echo "'mapEvents': true";
		?>
	});

	$(document).ready(
		$('#floorPicker').on('click', 'li', function(obj) {
			// $('#floorPicker li').removeClass('selected');
			// $(this).addClass('selected');
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
	});
</script>
