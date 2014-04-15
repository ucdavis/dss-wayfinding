<?php /* @var $this Controller */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />

	<!-- blueprint CSS framework -->
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/screen.css" media="screen, projection" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/print.css" media="print" />
	<!--[if lt IE 8]>
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/ie.css" media="screen, projection" />
	<![endif]-->

	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/main.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/form.css" />

	<title><?php echo CHtml::encode($this->pageTitle); ?></title>

    <style type="text/css" media="screen">
      ul li{
        list-style: none;
      }

      ul li{
        font-family: fontello;
        padding: 0;
      }


      #flyout-nav{
        width: 300px;
        height: 300px;
        position: relative;
        font-size: 40px;
        color: #fff;
      }

      .buttonContainer{
        margin: 0 auto;
      }

      #flyout-nav li{
        background: #a90329; /* Old browsers */
        background: -moz-radial-gradient(center, ellipse cover,  #a90329 0%, #8f0222 44%, #6d0019 100%); /* FF3.6+ */
        background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%,#a90329), color-stop(44%,#8f0222), color-stop(100%,#6d0019)); /* Chrome,Safari4+ */
        background: -webkit-radial-gradient(center, ellipse cover,  #a90329 0%,#8f0222 44%,#6d0019 100%); /* Chrome10+,Safari5.1+ */
        background: -o-radial-gradient(center, ellipse cover,  #a90329 0%,#8f0222 44%,#6d0019 100%); /* Opera 12+ */
        background: -ms-radial-gradient(center, ellipse cover,  #a90329 0%,#8f0222 44%,#6d0019 100%); /* IE10+ */
        background: radial-gradient(ellipse at center,  #a90329 0%,#8f0222 44%,#6d0019 100%); /* W3C */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a90329', endColorstr='#6d0019',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
        box-shadow: 0px 2px 10px rgba(0,0,0,0.5);
        text-align: center;
        border-radius: 150px;
      }

      #flyout-nav li#mainButton{
        font-size: 70px;
      }


    </style>
</head>

<body>

<div class="container" id="page">
	<?php $this->widget('application.extensions.flyoutnav.FlyoutNav', array(
		'list'=>array(
			CHtml::image(Yii::App()->baseUrl . '/images/people.svg'),
			CHtml::image(Yii::App()->baseUrl . '/images/map.svg'),
			CHtml::image(Yii::App()->baseUrl . '/images/info.svg'),
			CHtml::image(Yii::App()->baseUrl . '/images/calendar.svg')
		),
		'mainButton'=>CHtml::image(Yii::App()->baseUrl . '/images/touch.svg')
	)); ?>
	<?php echo $content; ?>
</div><!-- page -->

</body>
</html>
