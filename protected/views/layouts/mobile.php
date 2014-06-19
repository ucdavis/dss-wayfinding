<?php
/* @var $this Controller */
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />

	<?php Yii::app()->clientScript->registerCoreScript('jquery'); ?>
	<?php Yii::app()->clientScript->registerCoreScript('jquery.ui'); ?>
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/mobile.css" />

	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body>
<div id="header">
	<div id="search-box">
		<input type="text" placeholder="Search People and Places...">
	</div>
	<input type="hidden" id="startpoint" value="<?php echo $this->startpoint; ?>">
</div>
<div id="content">
	<?php echo $content; ?>
</div>
<!-- page -->
</body>
<script type="text/javascript">
$(document).ready(function () {
	$('#header > #search-box > input').autocomplete({
		autoFocus: true,
		source: [
		<?php foreach ($this->searchterms as $term) {
			echo '{ label: "' . $term['label']
				. '", value: "' . $term['action'] . ':' . $term['value'] . '"},';
		}
		?>],
		delay: 10,
		select: function(event, term) {
			event.preventDefault();

			var action = term.item.value.split(':')[0],
				value = term.item.value.split(':')[1];
			$('#header > #search-box > input').val(term.item.label);

			switch (action) {
			case 'route':
				$('#myMaps').wayfinding('routeTo', value);
				break;
			case 'routeGroup':
				$.get(
					'<?php echo Yii::App()->baseUrl; ?>',
					{
						r: 'wayfinding/map',
						startpoint: $('#startpoint').val(),
						routeGroup: value
					},
					function(data) {
						$('#content').html(data);
					}
				);
				break;
			}
		},
		focus: function(event, room) {
			event.preventDefault();
		},
		messages: {
			results: '',
			noResults: ''
		}
	});
});
</script>
</html>
