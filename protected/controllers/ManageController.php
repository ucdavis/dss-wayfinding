<?php

class ManageController extends CController
{
    /**
     * Declares class-based actions.
     */
    public function actions()
    {
        return array(
        );
    }

    public function filters()
    {
        return array (
            //Only cas-authenticated people in the group specified in the config
            //can do any of this. AuthFilter enforces that.
            array('application.filters.AuthFilter')
        );
    }

    /**
     * Action for batch update.
     */
    public function actionIndex()
    {
        $this->layout = 'manage';
        $this->render('manage');
    }

    public function actionPerson()
    {
        $this->layout = 'manage';
        $this->render('person',
            array(
                'people' => Person::model()->findAll('')
            )
        );
    }

    public function actionRoom()
    {
        $this->layout = 'manage';
        $this->render('room',
            array(
                'rooms' => Room::model()->findAll('')
            )
        );
    }

    /**
     * posts to this add or remove a department from the specified person.
     */
    public function actionUpdateDept()
    {
        $id = Yii::App()->request->getPost('id');
        $dept = Yii::App()->request->getPost('dept');
        $personId = Yii::App()->request->getPost('personId');
        $action = Yii::App()->request->getPost('action');

        if($action == 'delete') {
            PersonDept::model()->deleteByPk($id);
        } else if ($action == 'add') {
            $pd = new PersonDept();
            $pd->person_id = $personId;
            $pd->dept = $dept;
            $pd->save();
            $id = $pd->id;
        }
        echo CJavaScript::jsonEncode(array('id' => $id));
        Yii::app()->end();
    }

    /**
     * Posts to this associate or disassociate a person with a room.
     */
    public function actionUpdateRoom()
    {
        $id = Yii::App()->request->getPost('id');
        $roomId = Yii::App()->request->getPost('roomId');
        $personId = Yii::App()->request->getPost('personId');
        $action = Yii::App()->request->getPost('action');

        if($action == 'delete') {
            PersonRoom::model()->deleteByPk($id);
        } else if ($action == 'add') {
            $pr = new PersonRoom();
            $pr->person_id = $personId;
            $pr->room_id = $roomId;
            $pr->save();
            $id = $pr->id;
        }
        echo CJavaScript::jsonEncode(array('id' => $id));
        Yii::app()->end();
    }

    /**
     * Posts to this change a person's information.
     */
    public function actionUpdatePerson()
    {
        $personId = Yii::App()->request->getPost('personId');
        $email = Yii::App()->request->getPost('email');
        $firstName = Yii::App()->request->getPost('firstName');
        $lastName = Yii::App()->request->getPost('lastName');
        $action = Yii::App()->request->getPost('action');

        if ($action == 'delete') {
            Yii::App()->db->createCommand('PRAGMA foreign_keys = ON;')->execute();
            Person::model()->deleteByPk($personId);
        } else if ($action == 'edit') {
            $p = Person::model()->findByPk($personId);
            if ($p == NULL) {
                //Person does not exist. Create this new person.
                $p = new Person();
            }
            $p->email = $email;
            $p->firstname = $firstName;
            $p->lastname = $lastName;
            $p->save();
            $personId = $p->person_id;
        }
        echo CJavaScript::jsonEncode(array('id' => $personId));
        Yii::app()->end();
    }

    /**
     * Brings up the edit person form. If a person is specified, the data is filled
     * in, else, it is blank and the person is added to the database.
     */
    public function actionPersonForm($person = NULL)
    {
        $depts = array();
        $rooms = array();
        $roomList = array();

        if ($person === NULL) {
            $email = '';
            $firstName = '';
            $lastName = '';
        } else {
            $p = Person::model()->findByPk($person);
            $email = $p->email;
            $firstName = $p->firstname;
            $lastName = $p->lastname;
            $p = PersonDept::model()->findAllByAttributes(array('person_id' => $person));
            foreach ($p as $dept) {
                $depts[$dept->id] = $dept->dept;
            }
            $p = PersonRoom::model()->findAllByAttributes(array('person_id' => $person));
            foreach ($p as $room) {
                $rooms[$room->id] = Room::model()->findByPk($room->room_id)->wf_id;
            }
        }

        $allRooms = Room::model()->findAll();
        foreach ($allRooms as $room) {
            $roomList[$room->room_id] = $room->wf_id;
        }


        $this->layout = 'manage';
        $this->render('personform',
            array(
                'personId' => $person,
                'email' => $email,
                'firstName' => $firstName,
                'lastName' => $lastName,
                'depts' => $depts,
                'rooms' => $rooms,
                'allRooms' => $roomList
            )
        );
    }

    public function actionRoomForm($room = NULL)
    {
        $aliases = array();
        $groups = array();
        $groupList = array();

        if ($room === NULL) {
            $wf_id ='';
        } else {
            $r = Room::model()->findByPk($room);
            $wf_id = $r->wf_id;
            $rg = RoomGroup::model()->findAllByAttributes(array('room_id' => $room));
            foreach ($rg as $group) {
                $groups[] = $group->group_name;
            }
            $ra = RoomAlias::model()->findAllByAttributes(array('room_id' => $room));
            foreach ($ra as $alias) {
                $aliases[] = $alias->alias;
            }
        }

        $allGroups = RoomGroup::model()->findAll();
        foreach ($allGroups as $group) {
            $groupList[$room->room_id] = $room->wf_id;
        }


        $this->layout = 'manage';
        $this->render('roomform',
            array(
                'roomId' => $room,
                'wf_id' => $wf_id,
                'groups' => $groups,
                'aliases' => $aliases,
                'allGroups' => $groupList
            )
        );
    }

    /**
     * Takes the uploaded file and processes it.
     * Stores room data, which is prerequisite for call to batchUpdate().
     * Does some basic data cleanup.
     */
    public function actionUpdatewayfinding()
    {
        $success = true;
        $err = null;
        $data = array();

        if (isset($_FILES['roomList']) && $_FILES['roomList']['tmp_name'] != '') {
            $success = true;
            $csv_file = fopen($_FILES['roomList']['tmp_name'], 'r');

            $header = fgetcsv($csv_file);
            foreach ($header as $col) {
                $data[$col] = array();
            }

            while ($values = fgetcsv($csv_file)) {
                foreach ($header as $i => $col) {
                    $data[$col][] = $values[$i];
                }
            }

            // $rooms = $data['Room'];
            $data['First Name'] = array();
            $data['Last Name'] = array();

            foreach ($data['Name'] as $i => $name) {
                $name = explode(',', $name);
                /* Filters out entries in the "Name" field which do not have a ","
                 * This is intended to remove entries such as
                 * "General Graduate Student" which are mostly unhelpful noise,
                 * since real people have their name in the form Lastname, Firstname
                 */
                if (count($name) == 2) {
                    $data['First Name'][$i] = trim($name[1]);
                    $data['Last Name'][$i] = trim($name[0]);
                } else {
                    $data['First Name'][$i] = '';
                    $data['Last Name'][$i] = '';
                }
            }

            $this->batchUpdate($data);
        } else {
            $success = false;
            $err = 'Error: No file uploaded.';
        }

        $this->layout = 'manage';
        $this->render('manage', array(
            'success' => $success,
            'error' => $err
        ));
    }

    /**
     * Updates the database. Semi-destructive operation: anything with
     * delete_on_update set to 1 is deleted. Anything that should not be
     * deleted should be set to 0 (the default) because of this.
     */
    public function batchUpdate($data) {
        Yii::App()->db->createCommand('PRAGMA foreign_keys = ON;')->execute();
        $transaction = Yii::App()->db->beginTransaction();
        try {
            //delete all previous batch-loaded db values
            //before batch-loading new values. Removed so that old values
            //don't pile up.
            Person::model()->deleteAll('delete_on_update=1');
            Room::model()->deleteAll('delete_on_update=1');

            //populate db tables with batch-loaded values
            //dupes are collapsed by db in most cases.
            foreach($data['Name'] as $i => $Name) {
                $p = new Person();
                $r = new Room();
                $ra = new RoomAlias();
                $pd = new PersonDept();
                $pr = new PersonRoom();

                $p = $p->buildPerson($data, $i);
                $r = $r->buildRoom($data, $i);
                if ($p !== NULL && $r !==NULL) {
                    $pr->person_id = $p->person_id;
                    $pr->room_id = $r->room_id;
                    $pr->save();
                }
                if ($r !== NULL) {
                    $ra->room_id = $r->room_id;
                    $ra->alias = $data['Room'][$i];
                    $ra->save();
                }
                if ($p !==NULL) {
                    $pd->person_id = $p->person_id;
                    $pd->dept = $data['Department'][$i];
                    $pd->save();
                }
            }

            $transaction->commit();
        } catch (Exception $e) {
            var_dump($e);
            $transaction->rollback();
        }
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
