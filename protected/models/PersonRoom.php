<?php

class PersonRoom extends CActiveRecord
{
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	public function tableName()
	{
		return 'tbl_person_rooms';
	}

	public function primaryKey()
	{
		return 'id';
	}
}

?>
