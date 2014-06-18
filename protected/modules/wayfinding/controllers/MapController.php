<?php

class MapController extends Controller
{
	protected $jsUrl;
	protected $cssUrl;
	private $dataStoreCache;
	private $wayFound = false;

	public function actionIndex($startpoint, $endpoint=null, $routeGroup=null, $accessibleRoute = false)
	{
		$this->publishAssets();
		$this->registerClientScripts();

		$maps_base = Yii::App()->request->baseUrl . '/images/maps/';

		if (isset($routeGroup)) {
			$rg = RoomGroup::model()->findAllByAttributes(array(
				'group_name' => $routeGroup
			));

			$routeGroup = array();
			foreach($rg as $room) {
				$routeGroup[] = Room::model()->findByPk($room->room_id)['wf_id'];
			}
		}

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
			'routeGroup' => $routeGroup
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

		$speculativePath = '/datastore' . $startpoint . '.json';

		if (file_exists($cacheDir . $speculativePath)) {
			$this->dataStoreCache = Yii::App()->baseUrl .
				rtrim(Yii::App()->controller->module->cacheDir, '/') .
				$speculativePath;
			$this->wayFound = true;
		} else {
			$this->dataStoreCache = Yii::App()->baseUrl .
				rtrim(Yii::App()->controller->module->cacheDir, '/') .
				'/datastore.json';
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
