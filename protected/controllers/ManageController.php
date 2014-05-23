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
            $roomsWithOccupants = array(
                'First Name' => array(),
                'Last Name' => array(),
                'Room' => array()
            );

            foreach ($data['Name'] as $i => $name) {
                $name = explode(',', $name);
                /* Filters out entries in the "Name" field which do not have a ","
                 * This is intended to remove entries such as
                 * "General Graduate Student" which are mostly unhelpful noise,
                 * since real people have their name in the form Lastname, Firstname
                 */
                if (count($name) == 2) {
                    $roomsWithOccupants['First Name'][] = $name[1];
                    $roomsWithOccupants['Last Name'][] = $name[0];
                    $roomsWithOccupants['Room'][] = $data['Room'][$i];
                }
            }
        } else {
            $success = false;
            $err = 'Error: No file uploaded.';
        }

        $this->renderPartial('manage', array(
            'success' => $success,
            'error' => $err
        ));
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
