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
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/main.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/flyout.css" />

	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body>
<div id="header">
<?php echo CHtml::image(Yii::App()->request->baseUrl . '/images/lslogo.png', 'L&S Logo', array('id'=>'logo')); ?>
	<div id="search-box">
		<input type="text">
	</div>
	<input type="hidden" id="startpoint" value="<?php echo $this->startpoint; ?>">
</div>
<div id="navigation">
	<?php
		echo "<div>";
		echo CHtml::ajaxLink(
			CHtml::image(Yii::App()->request->baseUrl . '/images/people.svg'),
			array('people/index'),
			array('update' => '#content'),
			array('id'=>'people')
		);
		echo "<span><div class='navText'>People</div></span>";
		echo "</div>";
		echo "<div>";
		echo CHtml::ajaxLink(
			CHtml::image(Yii::App()->request->baseUrl . '/images/map.svg'),
			array('wayfinding/map', 'startpoint'=> $this->startpoint),
			array('update' => '#content'),
			array('id'=>'map')
		);
		echo "<span><div class='navText'>Building Map</div></span>";
		echo "</div>";
		echo "<div class='selected'>";
		echo CHtml::ajaxLink(
			CHtml::image(Yii::App()->request->baseUrl . '/images/calendar.svg'),
			array('events/index'),
			array('update' => '#content'),
			array('id'=>'events')
		);
		echo "<span><div class='navText'>Events</div></span>";
		echo "</div>";
		echo "<div>";
		echo CHtml::ajaxLink(
			CHtml::image(Yii::App()->request->baseUrl . '/images/info.svg'),
			array('index/about'),
			array('update' => '#content'),
			array('id'=>'about')
		);
		echo "<span><div class='navText'>About Building</div></span>";
		echo "</div>";
	?>
</div>
<div id="content">
	<?php echo $content; ?>
</div>
<!-- page -->
</body>
<script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/scripts/navigation.js"></script>
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
			case 'person':
				$.get(
					'<?php echo Yii::App()->baseUrl; ?>',
					{
						r: 'people/person',
						personId: value
					},
					function(data) {
						$('#navigation').find('*').addBack()
						.removeClass('selected');
						$('#people').parent().addClass('selected');
						$('#content').html(data);
					}
				);
				break;
			case 'route':
				$.get(
					'<?php echo Yii::App()->baseUrl; ?>',
					{
						r: 'wayfinding/map',
						startpoint: $('#startpoint').val(),
						endpoint: value
					},
					function(data) {
						$('#navigation').find('*').addBack()
						.removeClass('selected');
						$('#map').parent().addClass('selected');
						$('#content').html(data);
					}
				);
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
						$('#navigation').find('*').addBack()
						.removeClass('selected');
						$('#map').parent().addClass('selected');
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
