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

	public function getRoutingRoom($personId)
	{
		$room = $this->findByAttributes(array(
			'person_id' => $personId,
			'default_room' => 1
		));

		if ($room !== NULL) {
			return $room;
		} else {
			return $this->findByAttributes(array(
				'person_id' => $personId
			));
		}
	}
}

?>
