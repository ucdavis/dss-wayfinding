<?php

class RoomAlias extends CActiveRecord
{
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	public function tableName()
	{
		return 'tbl_room_alias';
	}

	public function primaryKey()
	{
		return 'id';
	}
}

?>
