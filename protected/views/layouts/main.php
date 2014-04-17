<?php
/* @var $this Controller */
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />

	<?php Yii::app()->clientScript->registerCoreScript('jquery'); ?>
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/main.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/flyout.css" />

	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body>
<div id="header">
<?php echo CHtml::image(Yii::App()->request->baseUrl . '/images/lslogo.png', 'L&S Logo', array('id'=>'logo')); ?>
</div>
<div id="image">
<img src="http://psychology.ucdavis.edu/Labs/PWT/Image/Yonelinas/Soc_Sci_Humanities_80.jpg" />
</div>
<div id="rss">
	<h1>Seminars</h1>
	<?php
	$this->widget(
	'ext.yii-feed-widget.YiiFeedWidget',
	array('url'=>'http://economics.ucdavis.edu/seminars/seminars/RSS', 'limit'=>'3')
	);
	?>
</div>
<div id="navigation">
	<?php $this->widget('application.extensions.flyoutnav.FlyoutNav', array(
		'list'=>array(
			// CHtml::link(
				CHtml::image(Yii::App()->request->baseUrl . '/images/people.svg'),
				// array('index/people')
			// ),
			CHtml::link(
				CHtml::image(Yii::App()->request->baseUrl . '/images/map.svg'),
				array('index/people')
			),
			CHtml::link(
				CHtml::image(Yii::App()->request->baseUrl . '/images/info.svg'),
				array('index/people')
			),
			CHtml::link(
				CHtml::image(Yii::App()->request->baseUrl . '/images/calendar.svg'),
				array('index/people')
			),
		),
		'mainButton'=>CHtml::image(Yii::App()->baseUrl . '/images/touch.svg'),
		'radius'=>90,
		'totalDegrees'=>180,
		'reverseIn'=>'true'
	)); ?>
</div>
<div id="content">
	<?php echo $content; ?>
</div>
<div id="homeButton">
	<?php echo CHtml::image(Yii::App()->request->baseUrl . '/images/home.svg', 'Home Button'); ?>
</div>
<!-- page -->
</body>
<script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/scripts/navigation.js"></script>
</html>
