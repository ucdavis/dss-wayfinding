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

    /**
     * This is the default 'index' action that is invoked
     * when an action is not explicitly requested by users.
     */
    public function actionIndex()
    {
        // renders the view file 'protected/views/site/index.php'
        // using the default layout 'protected/views/layouts/main.php'
        $this->renderPartial('manage');
    }

    public function actionUpdaterooms()
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

            $rooms = $data['Room'];
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

        $this->renderPartial('manage', array(
            'success' => $success,
            'error' => $err
        ));
    }

    public function batchUpdate($data) {
        Yii::App()->db->createCommand('PRAGMA foreign_keys = ON;')->execute();
        $transaction = Yii::App()->db->beginTransaction();
        try {
            //delete all previous batch-loaded db values
            //before batch-loading new values. Removed so that old values
            //don't pile up.
            $p = new Person();
            $r = new Room();
            $p->deleteAll('delete_on_update=1');
            $r->deleteAll('delete_on_update=1');

            //populate db tables with batch-loaded values
            //dupes are collapsed by db in most cases.
            foreach($data['Name'] as $i => $Name) {
                $p = new Person();
                $r = new Room();
                $pd = new PersonDept();
                $pr = new PersonRoom();

                $p = $p->buildPerson($data, $i);
                $r = $r->buildRoom($data, $i);
                if ($p !== NULL && $r !==NULL) {
                    $pr->person_id = $p->person_id;
                    $pr->room_id = $r->room_id;
                    $pr->save();
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
