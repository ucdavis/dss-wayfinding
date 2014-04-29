<?php

class MapController extends Controller
{
	protected $jsUrl;
	protected $cssUrl;
	private $dataStoreCache;
	private $wayFound = false;

	public function actionIndex($startpoint, $endpoint=null, $accessibleRoute = false)
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
			'accessibleRoute' => $accessibleRoute,
			'showLocation' => Yii::App()->controller->module->showLocation,
			'locationIndicator' => Yii::App()->controller->module->locationIndicator,
			'dataStoreCache' => $this->getDataStorePath($startpoint),
			'wayFound' => $this->wayFound,
		),
		false,
		true
		);
	}

	protected function getDataStorePath($startpoint) {
		if (isset(Yii::App()->controller->module->cacheDir)) {
			$cacheDir = Yii::getPathOfAlias('webroot') . rtrim(Yii::App()->controller->module->cacheDir, '/');
		} else {
			return;
		}

		$speculativePath = $cacheDir . '/datastore' . $startpoint . '.json';

		if (file_exists($speculativePath)) {
			$this->dataStoreCache = $speculativePath;
			$this->wayFound = true;
		} else {
			$this->dataStoreCache = $cacheDir . '/datastore.json';
		}

		return $this->dataStoreCache;
	}

	public function publishAssets() {
		if(empty($this->jsUrl)){
			$jsDir = Yii::getPathOfAlias('wayfinding') . DIRECTORY_SEPARATOR . 'js';
			$this->jsUrl = Yii::app()->getAssetManager()->publish($jsDir, false, -1, false);
		}
		if(empty($this->cssUrl)){
			$cssDir = Yii::getPathOfAlias('wayfinding') . DIRECTORY_SEPARATOR . 'css';
			$this->cssUrl = Yii::app()->getAssetManager()->publish($cssDir, false, -1, false);
		}
		return $this;
	}

	protected function registerClientScripts() {
		$clientScript = Yii::app()->clientScript;
		$clientScript->registerCoreScript('jquery');
		$clientScript->registerScriptFile($this->jsUrl . DIRECTORY_SEPARATOR . 'jquery.wayfinding.js');
		$clientScript->registerCssFile($this->cssUrl . DIRECTORY_SEPARATOR . 'map.css');
	}
}
