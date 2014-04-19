<?php

class Wayfinding extends CWebModule
{
    public $maps;
    public $startpoint;
    public $options;

    protected $baseUrl;

    public function actions()
    {
        return array(
            'loadScripts'=>'ext.wayfinding.Wayfinding.actions.LoadScriptsAction',
        );
    }

    public function init() {
        $this->publishAssets();
        $this->registerClientScripts();

        $this->render('wayfinding', array(
            'maps'=>$this->maps,
            'startpoint'=>$this->startpoint,
            'options'=>$this->options
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
        $clientScript->registerScriptFile($this->baseUrl . DIRECTORY_SEPARATOR . 'jquery.wayfinding.js');
    }
}

?>
