<?php

class Room extends CActiveRecord
{
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	public function tableName()
	{
		return 'tbl_rooms';
	}

	public function primaryKey()
	{
		return 'room_id';
	}

	public function buildRoom($data, $i = NULL)
	{
		if ($i === NULL) {
			$this->wf_id = 'R' . $data['Room'];
			$this->room_name = $data['Room'];
			$this->save();

			//find room in case it was a dupe.
			if ($this->room_id === NULL) {
				return $this->find(
				'wf_id=:wf_id AND room_name=:room_name',
				array(
					':wf_id' => 'R' . $data['Room'],
					':room_name' => $data['Room']
				));
			}
		} else {
			$this->wf_id = 'R' . $data['Room'][$i];
			$this->room_name = $data['Room'][$i];
			$this->delete_on_update = 1;
			$this->save();

			//find room in case it was a dupe.
			if ($this->room_id === NULL) {
				return $this->find(
				'wf_id=:wf_id AND room_name=:room_name',
				array(
					':wf_id' => 'R' . $data['Room'][$i],
					':room_name' => $data['Room'][$i]
				));
			}
		}

		return $this;
	}
}

?>
