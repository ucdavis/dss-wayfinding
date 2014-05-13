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
<div id="navigation">
	<?php
		echo "<div>";
		echo CHtml::ajaxLink(
			CHtml::image(Yii::App()->request->baseUrl . '/images/people.svg'),
			array('people/index'),
			array('update' => '#content')
		);
		echo "</div>";
		echo "<div>";
		echo CHtml::ajaxLink(
			CHtml::image(Yii::App()->request->baseUrl . '/images/map.svg'),
			array('wayfinding/map', 'startpoint'=> 'R1291'),
			array('update' => '#content')
		);
		echo "</div>";
		echo "<div>";
		echo CHtml::ajaxLink(
			CHtml::image(Yii::App()->request->baseUrl . '/images/calendar.svg'),
			array('events/index'),
			array('update' => '#content'),
			array('class' => 'selected')
		);
		echo "</div>";
		echo "<div>";
		echo CHtml::ajaxLink(
			CHtml::image(Yii::App()->request->baseUrl . '/images/info.svg'),
			array('index/about'),
			array('update' => '#content')
		);
		echo "</div>";
	?>
</div>
<div id="content">
	<?php echo $content; ?>
</div>
<!-- page -->
</body>
<script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/scripts/navigation.js"></script>
</html>
