<?php

class MobileController extends CController
{
    //variable is used in the layout to initialize the autocomplete search.
    public $searchterms = array();
    public $startpoint;

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
        $r = RoomAlias::model()->findAll();
        $p = Person::model()->findAll();
        $rg = RoomGroup::model()->allGroups();
        foreach($r as $room) {
            $this->searchterms[] = array(
                'label' => $room->alias,
                'action' => 'route',
                'value' => Room::model()->findByAttributes(
                    array(
                        'room_id' => $room->room_id
                    )
                )->wf_id
            );
        }
        foreach ($p as $person) {
            $routingRoom = PersonRoom::model()->getRoutingRoom($person->person_id);
            $routingRoom = Room::model()->findByPk($routingRoom->room_id);
            $this->searchterms[] = array(
                'label' => $person->lastname . ', ' . $person->firstname,
                'action' => 'route',
                'value' => $routingRoom->wf_id
            );
        }
        foreach ($rg as $group) {
            $this->searchterms[] = array(
                'label' => $group,
                'action' => 'routeGroup',
                'value' => $group
            );
        }

        $this->startpoint = Yii::App()->request->getParam('startpoint');
        if (!isset($this->startpoint)) {
            $this->startpoint = DEFAULT_STARTPOINT;
        }

        $this->layout = 'mobile';
        $this->render('map');
    }

    /**
     * This is the action to handle external exceptions.
     */
    public function actionError()
    {
        if($error=Yii::app()->errorHandler->error)
        {
            if(Yii::app()->request->isAjaxRequest)
                echo $error['message'];
            else
                $this->renderPartial('error', $error);
        }
    }
}
