<?php
/* @var $this DefaultController */
?>
<div id="mapLoading">
	<?php
		echo CHtml::image(Yii::App()->request->baseUrl . '/images/loading.gif');
	?>
</div>
<div id="floorPicker">
	<ul>
		<?php
			foreach($maps as $id => $map) {
				echo "<li id='$id'>" . $map['name'] . "</li>";
			}
		?>
	</ul>
</div>
<div id="myMaps"></div>
<script type="text/javascript" id="loadMaps">
	$('#myMaps').wayfinding({
		<?php
			ob_start();
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
			// $cont = ob_get_contents();
			// ob_end_clean();
			if (isset($endpoint)) echo "'endpoint': $endpoint,";
			if (isset($showLocation)) echo "'showLocation': $showLocation,";
			// if (isset($zoomPadding)) echo "'zoomPadding': $zoomPadding,";
			// if (isset($zoomPadding)) echo "'zoomPadding': $zoomPadding,";
			// if (isset($zoomPadding)) echo "'zoomPadding': $zoomPadding,";
			echo "'accessibleRoute': $accessibleRoute";
			$cont = ob_get_contents();
			ob_end_flush();
		?>
	});

	$(document).ready(
		$('#floorPicker').on('click', 'li', function(obj) {
			// alert($(this));
			$('#myMaps').wayfinding('currentMap', $(this).attr('id'));
		})
	);
</script>
<?php //echo $cont; ?>
