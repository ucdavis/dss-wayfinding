<?php

class DefaultController extends Controller
{
	protected $baseUrl;

	public function actionIndex()
	{
		$this->publishAssets();
		$this->registerClientScripts();

		$maps_base = Yii::App()->request->baseUrl . '/images/maps/';

		$this->renderPartial('map', array(
			'maps' => Yii::App()->controller->module->maps,
			'startpoint' => Yii::App()->controller->module->startpoint
		),
		false,
		true
		);
	}

	public function publishAssets() {
		if(empty($this->baseUrl)){
			$assetsDir = Yii::getPathOfAlias('wayfinding') . DIRECTORY_SEPARATOR . 'js';
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
