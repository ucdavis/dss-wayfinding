<?php

class PeopleController extends CController
{
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
        // renders the view file 'protected/views/site/index.php'
        // using the default layout 'protected/views/layouts/main.php'
        $this->actionPeople();
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

    public function actionPeople()
    {
        $people = Person::model()->findAll(array('order' => 'lastname'));
        foreach($people as $i => $person) {
            $peopleInfo[$i]['person'] = $person;
            $peopleInfo[$i]['depts'] = PersonDept::model()->getDepts($person->person_id);
        }
        $this->renderPartial('people', array(
            'depts' => PersonDept::model()->getDeptList(),
            'peopleInfo' => $peopleInfo
        ));
    }

    public function actionPerson($personId)
    {
        $p = Person::model()->findByPk($personId);
        $depts = PersonDept::model()->getDepts($personId);
        $pr = PersonRoom::model()->findAllByAttributes(array(
            'person_id' => $personId
        ));
        $rooms = array();
        foreach ($pr as $r) {
            $aliases = RoomAlias::model()->findAllByAttributes(array(
                'room_id' => $r->room_id
            ));
            $rooms = array_merge($rooms, $aliases);
        }
        $office = PersonRoom::model()->findByAttributes(array(
            'person_id' => $personId,
            'default_room' => 1
        ));
        if ($office != NULL) {
            $office = RoomAlias::model()->findByAttributes(array(
                'room_id' => $office->room_id
            ));
        }
        $routingRoom = PersonRoom::model()->getRoutingRoom($personId);
        if (isset($routingRoom)) {
        $routingRoom = Room::model()->findByPk($routingRoom->room_id);}
        $this->renderPartial('person', array(
            'personId' => $personId,
            'person' => $p,
            'depts' => $depts,
            'office' => $office,
            'routingRoom' => $routingRoom->wf_id,
            'rooms' => $rooms
        ));
    }
}
