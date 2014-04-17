<?php

class MapController extends CController
{
    public $startpoint = 'R1291';

    /**
     * Declares class-based actions.
     */
    public function actions()
    {
        return array(
        );
    }

    /**
     * This is the default 'index' action that is invoked
     * when an action is not explicitly requested by users.
     */
    public function actionIndex()
    {
        $maps_base = Yii::App()->request->baseUrl . '/images/maps/';

        $this->renderPartial('map', array(
            'maps' => array(
                $maps_base . 'ssh_floor_0.svg',
                $maps_base . 'ssh_floor_1.svg',
                $maps_base . 'ssh_floor_2.svg',
                $maps_base . 'ssh_floor_3.svg',
                $maps_base . 'ssh_floor_4.svg',
                $maps_base . 'ssh_floor_5.svg'
            ),
            'startpoint' => 'R1291',
            false,
            true
        ));
    }
}
