<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name;
?>
<?php
	$this->widget('application.extensions.wayfinding.Wayfinding', array('maps'=>$maps, 'startpoint'=>$startpoint));
?>
