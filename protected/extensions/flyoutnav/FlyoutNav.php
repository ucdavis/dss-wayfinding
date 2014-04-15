<?php

class FlyoutNav extends CWidget
{
    public $baseUrl;
    public $list;
    public $mainButton;

    public function init() {
        $this->publishAssets();
        $this->registerClientScripts();

        $this->render('flyout', array(
            'list'=>$this->list,
            'mainButton'=>$this->mainButton
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
