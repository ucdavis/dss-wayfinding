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
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/manage.css" />

	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body>
<div id="header">
<?php
	echo CHtml::link('Batch Update', array('manage/index'), array('style' => 'margin: 10px;'));
	echo CHtml::link('Room Management', array('manage/room'), array('style' => 'margin: 10px;'));
	echo CHtml::link('Person Management', array('manage/person'), array('style' => 'margin: 10px;'));
?>
</div>
<div id="content">
	<?php echo $content; ?>
</div>
<!-- page -->
</body>
</html>
