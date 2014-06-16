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
	echo CHtml::hiddenField('personId', $roomId, array('id' => 'personId'));
	echo CHtml::label('Wayfinding ID: ', 'wf_id');
	echo CHtml::textField('wf_id', $wf_id, array('id' => 'wf_id', 'class' => 'blockInput', 'required' => 'required'));
	if ($roomId !== NULL) {
		echo CHtml::button('Update Room', array('id' => 'updateRoom'));
		echo CHtml::button('Delete Room', array('id' => 'deleteRoom')) . '<br />';
		echo CHtml::label('Departments: ', 'depts');
		echo '<ol id="aliases"><br />';
		foreach ($aliases as $i => $dept) {
			echo '<li id="' . $i . '">' . $dept;
			echo CHtml::button('remove', array('class' => 'removeDept')) . '</li>';
		}
		echo '<li>';
			echo CHtml::textField('newDept', '', array('id' => 'newDept'));
			echo CHtml::button('add', array('class' => 'addDept'));
		echo '</li>';
		echo '</ol>';
		echo CHtml::label('Rooms Occupied (Wayfinding ID): ', 'rooms');
		echo '<ol id="groups"><br />';
		foreach ($groups as $i => $room) {
			echo '<li id="' . $i . '">' . $room;
			echo CHtml::button('remove', array('class' => 'removeRoom')) . '</li>';
		}
		echo '<li>';
			echo CHtml::dropDownList('newGroup', '', $allGroups, array('id' => 'newGroup'));
			echo CHtml::button('add', array('class' => 'addRoom'));
		echo '</li>';
		echo '</ol>';
	} else {
		echo CHtml::button('Add Room', array('id' => 'updateRoom'));
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
					id: $(this).parent().attr('id'),
					action: 'delete'
				},
				success: function(data) {
					data = $.parseJSON(data);

					$('#' + data.id).remove();
				}
			});
		});

		$('.addDept').click(function() {
			$.ajax({
				url: '<?php echo CHtml::normalizeUrl(array("manage/updateDept")); ?>',
				type: 'post',
				data: {
					id: $(this).parent().attr('id'),
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
						'<li id=' + id + '>' + dept
						+ '<input type="button" class="removeDept" value="remove"></li>'
					);
					$('#newDept').val('');
				}
			});
		});

		$('ol').on('click', '.removeRoom', function() {
			$.ajax({
				url: '<?php echo CHtml::normalizeUrl(array("manage/updateRoom")); ?>',
				type: 'post',
				data: {
					id: $(this).parent().attr('id'),
					action: 'delete'
				},
				success: function(data) {
					data = $.parseJSON(data);

					$('#' + data.id).remove();
				}
			});
		});

		$('.addRoom').click(function() {
			$.ajax({
				url: '<?php echo CHtml::normalizeUrl(array("manage/updateRoom")); ?>',
				type: 'post',
				data: {
					id: $(this).parent().attr('id'),
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
						'<li id=' + id + '>' + room
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
