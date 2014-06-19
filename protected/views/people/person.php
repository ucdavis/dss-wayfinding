<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name;
?>
<h2><?php echo $person->firstname . ' ' . $person->lastname; ?></h2>
<?php
echo "<div id='maps'></div>";
echo "<input type='hidden' value='$routingRoom' id='routingRoom'>";
if ($depts != array()) {
	echo "<p><b>Depts:</b><br />";
}
$deptlist = '';
foreach ($depts as $dept) {
	$deptlist .= $dept . ', ';
}
$deptlist = rtrim($deptlist, ', ');
echo $deptlist . "</p>";
if ($person->email != '') {
	echo "<p>" .
		"<b>Contact Info:</b><br />" .
		"Email: " . $person->email .
	"</p>";
}
if (isset($office)) {
	echo "<p>" .
		"<b>Office:</b><br />" .
		$office->alias .
	"</p>";
}
if (isset($rooms)) {
	$roomlist = '';
	foreach($rooms as $room) {
		$roomlist .= $room->alias . ', ';
	}
	$roomlist = rtrim($roomlist, ', ');
	echo "<p>" .
		"<b>All Rooms Associated With $person->firstname $person->lastname:</b><br />" .
		$roomlist .
	"</p>";
}
echo "<input type='button' id='route' value='Find This Person'>";
?>
<script type="text/javascript">
	$('#route').click(function() {
		$.get(
			'<?php echo Yii::App()->baseUrl?>',
			{
				r: 'wayfinding/map',
				startpoint: $('#startpoint').val(),
				endpoint: $('#routingRoom').val()
			},
			function(data) {
				$('#navigation').find('*').addBack()
				.removeClass('selected');
				$('#map').parent().addClass('selected');
				$('#content').html(data);
			}
		);
	});
</script>
