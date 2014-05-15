<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name;
?>
<div class="secondaryNav">
    <h1>Events</h1>
</div>
<div id="rss">
        <?php
        $this->widget(
        'ext.yii-feed-widget.YiiFeedWidget',
        array('url'=>'http://economics.ucdavis.edu/seminars/seminars/RSS',
		'limit'=>3)
        );
        ?>
</div>
