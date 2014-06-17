<?php
/* @var $this SiteController */
	$this->pageTitle=Yii::app()->name;
?>
<h1>LCD Screen Management</h1>
<h2>Edit or Add a Person</h2>
<?php if (isset($success) && $success) { ?>
<span>Success! Wayfinding Updated</span>
<br /><br />
<?php } ?>
<?php if (isset($error) && $error) { ?>
<span><?php echo $error; ?></span>
<br /><br />
<?php } ?>
<form>
<?php
	echo CHtml::hiddenField('personId', $personId, array('id' => 'personId'));
	echo CHtml::label('Email: ', 'email');
	echo CHtml::textField('email', $email, array('id' => 'email', 'class' => 'blockInput', 'required' => 'required'));
	echo CHtml::label('First Name: ', 'firstName');
	echo CHtml::textField('firstName', $firstName, array('id' => 'firstName', 'class' => 'blockInput', 'required' => 'required'));
	echo CHtml::label('Last Name: ', 'lastName');
	echo CHtml::textField('lastName', $lastName, array('id' => 'lastName', 'class' => 'blockInput', 'required' => 'required'));
	if ($personId !== NULL) {
		echo CHtml::button('Update Person', array('id' => 'updatePerson'));
		echo CHtml::button('Delete Person', array('id' => 'deletePerson')) . '<br />';
		echo CHtml::label('Departments: ', 'depts');
		echo '<ol id="depts"><br />';
		foreach ($depts as $i => $dept) {
			echo '<li id="dept' . $i . '">' . $dept;
			echo CHtml::button('remove', array('class' => 'removeDept')) . '</li>';
		}
		echo '<li>';
			echo CHtml::textField('newDept', '', array('id' => 'newDept'));
			echo CHtml::button('add', array('class' => 'addDept'));
		echo '</li>';
		echo '</ol>';
		echo CHtml::label('Rooms Occupied (Wayfinding ID): ', 'rooms');
		echo '<ol id="rooms"><br />';
		foreach ($rooms as $i => $room) {
			echo '<li id="room' . $i . '">' . $room;
			echo CHtml::button('remove', array('class' => 'removeRoom')) . '</li>';
		}
		echo '<li>';
			echo CHtml::dropDownList('newRoom', '', $allRooms, array('id' => 'newRoom'));
			echo CHtml::button('add', array('class' => 'addRoom'));
		echo '</li>';
		echo '</ol>';
	} else {
		echo CHtml::button('Add Person', array('id' => 'updatePerson'));
	}
?>
</form>
<script type="text/javascript">
	$(document).ready(function() {
		$('ol').on('click', '.removeDept', function() {
			$.ajax({
				url: '<?php echo CHtml::normalizeUrl(array("manage/updateDept")); ?>',
				type: 'post',
				data: {
					id: $(this).parent().attr('id').replace('dept', ''),
					action: 'delete'
				},
				success: function(data) {
					data = $.parseJSON(data);

					$('#dept' + data.id).remove();
				}
			});
		});

		$('.addDept').click(function() {
			$.ajax({
				url: '<?php echo CHtml::normalizeUrl(array("manage/updateDept")); ?>',
				type: 'post',
				data: {
					action: 'add',
					personId: $('#personId').val(),
					dept: $('#newDept').val()
				},
				success: function(data) {
					var id, dept;
					data = $.parseJSON(data);

					id = data.id;
					dept = $('#newDept').val();
					$('#newDept').parent().before(
						'<li id="dept' + id + '">' + dept
						+ '<input type="button" class="removeDept" value="remove"></li>'
					);
					$('#newDept').val('');
				}
			});
		});

		$('ol').on('click', '.removeRoom', function() {
			$.ajax({
				url: '<?php echo CHtml::normalizeUrl(array("manage/updatePersonRoom")); ?>',
				type: 'post',
				data: {
					id: $(this).parent().attr('id').replace('room', ''),
					action: 'delete'
				},
				success: function(data) {
					data = $.parseJSON(data);

					$('#room' + data.id).remove();
				}
			});
		});

		$('.addRoom').click(function() {
			$.ajax({
				url: '<?php echo CHtml::normalizeUrl(array("manage/updatePersonRoom")); ?>',
				type: 'post',
				data: {
					action: 'add',
					personId: $('#personId').val(),
					roomId: $('#newRoom').val()
				},
				success: function(data) {
					var id, room;
					data = $.parseJSON(data);

					id = data.id;
					room = $('#newRoom option:selected').text();
					$('#newRoom').parent().before(
						'<li id="room' + id + '">' + room
						+ '<input type="button" class="removeRoom" value="remove"></li>'
					);
				}
			});
		});

		$('#deletePerson').click(function() {
			$.ajax({
				url: '<?php echo CHtml::normalizeUrl(array("manage/updatePerson")); ?>',
				type: 'post',
				data: {
					action: 'delete',
					personId: $('#personId').val()
				},
				success: function(data) {
					alert("success!");
				}
			});
		});

		$('#updatePerson').click(function() {
			$.ajax({
				url: '<?php echo CHtml::normalizeUrl(array("manage/updatePerson")); ?>',
				type: 'post',
				data: {
					action: 'edit',
					personId: $('#personId').val(),
					email: $('#email').val(),
					firstName: $('#firstName').val(),
					lastName: $('#lastName').val()
				},
				success: function(data) {
					alert("success!");
				}
			});
		});
	});
</script>
