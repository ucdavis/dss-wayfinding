<?php
/* @var $this SiteController */
$this->pageTitle=Yii::app()->name;
?>
<h1>Seminars</h1>
<?php
$this->widget(
   'ext.yii-feed-widget.YiiFeedWidget',
   array('url'=>'http://economics.ucdavis.edu/seminars/seminars/RSS', 'limit'=>'3')
);
?>
