<?php

class Person extends CActiveRecord
{
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	public function tableName()
	{
		return 'tbl_persons';
	}

	public function primaryKey()
	{
		return 'person_id';
	}

	public function buildPerson($data, $i = NULL)
	{
		if ($i === NULL) {
			$this->email = $data['Email'];
			$this->firstname = $data['First Name'];
			$this->lastname = $data['Last Name'];
			$this->save();

			//find person id in case it was a duplicate above
			//will still be NULL in the case that it was not a valid person.
			if ($this->person_id === NULL) {
				return $this->find('email=:email AND firstname=:fn AND lastname=:ln',
				array(
					':email' => $data['Email'],
					':fn' => $data['First Name'],
					':ln' => $data['Last Name']
				));
			}
		} else {
			if ($data['First Name'][$i] != '') {
				$this->email = $data['Email'][$i];
				$this->firstname = $data['First Name'][$i];
				$this->lastname = $data['Last Name'][$i];
				$this->delete_on_update = 1;
				$this->save();
			}

			//find person id in case it was a duplicate above
			//will still be NULL in the case that it was not a valid person.
			if ($this->person_id === NULL) {
				return $this->find('email=:email AND firstname=:fn AND lastname=:ln',
				array(
					':email' => $data['Email'][$i],
					':fn' => $data['First Name'][$i],
					':ln' => $data['Last Name'][$i]
				));
			}
		}

		return $this;
	}
}

?>
