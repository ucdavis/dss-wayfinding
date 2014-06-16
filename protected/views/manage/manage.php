<?php
/* @var $this SiteController */
	$this->pageTitle=Yii::app()->name;
?>
<h1>LCD Screen Management</h1>
<h2>Batch Update</h2>
<?php if (isset($success) && $success) { ?>
<span>Success! Wayfinding Updated</span>
<br /><br />
<?php } ?>
<?php if (isset($error) && $error) { ?>
<span><?php echo $error; ?></span>
<br /><br />
<?php } ?>
Upload CSV file with a list of room numbers under the heading "Room", and
names in the form of Lastname, Firstname under the heading "Name".
<form method="post" action="index.php?r=manage/updatewayfinding" enctype="multipart/form-data">
<label for="roomList">CSV File: </label>
<input type="file" name="roomList" id="roomList"><br />
<br /><input type="submit" value="Feed the beast!">
</form>
