<?php

class MapController extends Controller
{
	protected $baseUrl;

	public function actionIndex($startpoint, $endpoint=null, $accessibleRoute = 'false')
	{
		$this->publishAssets();
		$this->registerClientScripts();

		$maps_base = Yii::App()->request->baseUrl . '/images/maps/';

		$this->renderPartial('map', array(
			'maps' => Yii::App()->controller->module->maps,
			'path' => Yii::App()->controller->module->path,
			'startpoint' => $startpoint,
			'zoomToRoute' => Yii::App()->controller->module->zoomToRoute,
			'zoomPadding' => Yii::App()->controller->module->zoomPadding,
			'defaultMap' => Yii::App()->controller->module->defaultMap,
			'endpoint' => $endpoint,
			'accessibleRoute' => (string)$accessibleRoute
			// 'startpoint' => Yii::App()->controller->module->startpoint,
			// 'startpoint' => Yii::App()->controller->module->startpoint,
			// 'startpoint' => Yii::App()->controller->module->startpoint,
			// 'startpoint' => Yii::App()->controller->module->startpoint,
			// 'startpoint' => Yii::App()->controller->module->startpoint,
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
