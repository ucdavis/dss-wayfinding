<?php
//cas server details
define('CAS_HOST', 'cas.ucdavis.edu');
define('CAS_CONTEXT', 'cas');
define('CAS_PORT', 443);

//roles hostname
define('ROLES_MANAGEMENT_API', 'roles management hostname');

//roles management app name for this web app
define('ROLES_MANAGEMENT_APPNAME', 'roles management app name');

//roles secret key
define('ROLES_MANAGEMENT_SECRET', 'roles management secret');

//Group id of the group authorized to manage the website
define('MANAGEMENT_GROUP', 'group id authorized to manage');

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name'=>'Social Sciences and Humanities',

	'defaultController' => 'events',
	'controllerMap'=>array(
	    'YiiFeedWidget' => 'application.extensions.yii-feed-widget.YiiFeedWidgetController'
	),
	// preloading 'log' component
	'preload'=>array('log'),

	// autoloading model and component classes
	'import'=>array(
		'application.models.Person',
		'application.models.Room',
		'application.models.RoomGroup',
		'application.models.RoomAlias',
		'application.models.PersonDept',
		'application.models.PersonRoom',
		'application.components.*',
		'application.extensions.flyoutnav.*',
		'application.extensions.wayfinding.*'
	),

	'modules'=>array(
		// uncomment the following to enable the Gii tool
		'gii'=>array(
			'class'=>'system.gii.GiiModule',
			'password'=>'AdminPass',
			// If removed, Gii defaults to localhost only. Edit carefully to taste.
			'ipFilters'=>array('127.0.0.1','::1'),
		),
		'wayfinding' => array('maps' => array(
			'floor0' => array(
				'path' => 'images/maps/ssh_floor_0.svg',
				'name' => 'Basement'
			),
			'floor1' => array(
				'path' => 'images/maps/ssh_floor_1.svg',
				'name' => 'Floor 1'
			),
			'floor2' => array(
				'path' => 'images/maps/ssh_floor_2.svg',
				'name' => 'Floor 2'
			),
			'floor3' => array(
				'path' => 'images/maps/ssh_floor_3.svg',
				'name' => 'Floor 3'
			),
			'floor4' => array(
				'path' => 'images/maps/ssh_floor_4.svg',
				'name' => 'Floor 4'
			),
			'floor5' => array(
				'path' => 'images/maps/ssh_floor_5.svg',
				'name' => 'Floor 5'
			)
		),
		'path' => array(
			'color' => 'red', // the color of the solution path that will be drawn
			'radius' => 5, // the radius in pixels to apply to the solution path
			'speed' => 12, // the speed at which the solution path with be drawn
			'width' => 3 // the width of the solution path in pixels
		),
		'zoomToRoute' => true,
		'zoomPadding' => 50,
		'defaultMap' => 'floor1',
		'showLocation' => true,
		'locationIndicator' => array(
			'fill' => 'blue',
			'height' => 25
		),
		'cacheDir' => Yii::getPathOfAlias('webroot') . '/datastores/')
	),

	// application components
	'components'=>array(
		'user'=>array(
			// enable cookie-based authentication
			'allowAutoLogin'=>true,
		),
		// uncomment the following to enable URLs in path-format
		/*
		'urlManager'=>array(
			'urlFormat'=>'path',
			'rules'=>array(
				'<controller:\w+>/<id:\d+>'=>'<controller>/view',
				'<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
				'<controller:\w+>/<action:\w+>'=>'<controller>/<action>',
			),
		),
		*/
		'db'=>array(
			'connectionString' => 'sqlite:protected/data/wayfinding.db',
		),
		// uncomment the following to use a MySQL database
		/*
		'db'=>array(
			'connectionString' => 'mysql:host=localhost;dbname=testdrive',
			'emulatePrepare' => true,
			'username' => 'root',
			'password' => '',
			'charset' => 'utf8',
		),
		*/
		'errorHandler'=>array(
			// use 'site/error' action to display errors
			'errorAction'=>'site/error',
		),
		'log'=>array(
			'class'=>'CLogRouter',
			'routes'=>array(
				array(
					'class'=>'CFileLogRoute',
					'levels'=>'error, warning',
				),
				// uncomment the following to show log messages on web pages
		        array(
		            'class' => 'CWebLogRoute',
		            'enabled' => YII_DEBUG,
		            'levels' => 'error, warning, trace, notice',
		            'categories' => 'application',
		            'showInFireBug' => false,
		        ),
			),
		),
	),

	// application-level parameters that can be accessed
	// using Yii::app()->params['paramName']
	'params'=>array(
		// this is used in contact page
		'adminEmail'=>'webmaster@example.com',
	),
);
