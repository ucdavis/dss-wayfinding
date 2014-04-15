<?php

class FlyoutNav extends CWidget
{
    public $baseUrl;
    public $list;
    public $mainButton;

    //flyout plugin options
    public $radius;
    public $totalDegrees;
    public $offsetx;
    public $offsety;
    public $angleOffset;
    public $duration;
    public $delay;
    public $startRotation;
    public $endRotation;
    public $flyoutSizePercent;
    public $reverseOut;
    public $reverseIn;
    public $modalBGColor;
    public $hardcoreMode;

    public function init() {
        $this->publishAssets();
        $this->registerClientScripts();

        $this->render('flyout', array(
            'list'=>$this->list,
            'mainButton'=>$this->mainButton,
            'radius' => $this->radius,
            'totalDegrees' => $this->totalDegrees,
            'offsetx' => $this->offsetx,
            'offsety' => $this->offsety,
            'angleOffset' => $this->angleOffset,
            'duration' => $this->duration,
            'delay' => $this->delay,
            'startRotation' => $this->startRotation,
            'endRotation' => $this->endRotation,
            'flyoutSizePercent' => $this->flyoutSizePercent,
            'reverseOut' => $this->reverseOut,
            'reverseIn' => $this->reverseIn,
            'modalBGColor' => $this->modalBGColor,
            'hardcoreMode' => $this->hardcoreMode
        ));
    }

    public function publishAssets() {
        if(empty($this->baseUrl)){
            $assetsDir = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'assets';
            $this->baseUrl = Yii::app()->getAssetManager()->publish($assetsDir, false, -1, false);
        }
        return $this;
    }

    protected function registerClientScripts() {
        $clientScript = Yii::app()->clientScript;
        $clientScript->registerCoreScript('jquery');
        $clientScript->registerScriptFile($this->baseUrl . DIRECTORY_SEPARATOR . 'jquery.flyout.js', CClientScript::POS_HEAD);
    }
}

?>
