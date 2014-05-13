<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name;
?>
<div id="rss">
        <h1>Seminars</h1>
        <?php
        $this->widget(
        'ext.yii-feed-widget.YiiFeedWidget',
        array('url'=>'http://www.npr.org/rss/rss.php?id=1001',//http://economics.ucdavis.edu/seminars/seminars/RSS', 
		'limit'=>0)
        );
        ?>
</div>
