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

	public function getDeptList()
	{
		$groups = Yii::app()->db->createCommand()
			->selectDistinct('dept')
			->from($this->tableName())
			->queryColumn();

		return $groups;
	}
}

?>
