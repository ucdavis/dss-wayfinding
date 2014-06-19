<?php

class PersonDept extends CActiveRecord
{
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	public function tableName()
	{
		return 'tbl_person_depts';
	}

	public function primaryKey()
	{
		return 'id';
	}

	//returns all depts that have members.
	public function getDeptList()
	{
		$depts = Yii::app()->db->createCommand()
			->selectDistinct('dept')
			->from($this->tableName())
			->queryColumn();

		return $depts;
	}

	//gets depts that a specific person is a member of.
	public function getDepts($personId)
	{
		$depts = Yii::app()->db->createCommand()
			->selectDistinct('dept')
			->from($this->tableName())
			->where('person_id=:pid', array(':pid' => $personId))
			->queryColumn();

		return $depts;
	}
}

?>
