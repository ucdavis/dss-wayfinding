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
	echo CHtml::hiddenField('roomId', $roomId, array('id' => 'roomId'));
	echo CHtml::label('Wayfinding ID: ', 'wf_id');
	echo CHtml::textField('wf_id', $wf_id, array('id' => 'wf_id', 'class' => 'blockInput', 'required' => 'required'));
	if ($roomId !== NULL) {
		echo CHtml::button('Update Room', array('id' => 'updateRoom'));
		echo CHtml::button('Delete Room', array('id' => 'deleteRoom')) . '<br />';
		echo CHtml::label('Room Names (aliases as viewed by users): ', 'depts');
		echo '<ol id="aliases"><br />';
		foreach ($aliases as $i => $alias) {
			echo '<li id="alias' . $i . '">' . $alias;
			echo CHtml::button('remove', array('class' => 'removeAlias')) . '</li>';
		}
		echo '<li>';
			echo CHtml::textField('newAlias', '', array('id' => 'newAlias'));
			echo CHtml::button('add', array('class' => 'addAlias'));
		echo '</li>';
		echo '</ol>';
		echo CHtml::label('Room Groups: ', 'groups');
		echo '<ol id="groups"><br />';
		foreach ($groups as $i => $room) {
			echo '<li id="' . $i . '">' . $room;
			echo CHtml::button('remove', array('class' => 'removeGroup')) . '</li>';
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
		$('ol').on('click', '.removeAlias', function() {
			$.ajax({
				url: '<?php echo CHtml::normalizeUrl(array("manage/updateRoomAlias")); ?>',
				type: 'post',
				data: {
					id: $(this).parent().attr('id').replace('alias', ''),
					action: 'delete'
				},
				success: function(data) {
					data = $.parseJSON(data);

					$('#alias' + data.id).remove();
				}
			});
		});

		$('.addAlias').click(function() {
			$.ajax({
				url: '<?php echo CHtml::normalizeUrl(array("manage/updateRoomAlias")); ?>',
				type: 'post',
				data: {
					action: 'add',
					roomId: $('#roomId').val(),
					alias: $('#newAlias').val()
				},
				success: function(data) {
					var id, alias;
					data = $.parseJSON(data);
					alert('here');
					id = data.id;
					alias = $('#newAlias').val();
					$('#newAlias').parent().before(
						'<li id="alias' + id + '">' + alias
						+ '<input type="button" class="removeAlias" value="remove"></li>'
					);
					$('#newAlias').val('');
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
					roomId: $('#roomId').val()
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

		$('#deleteRoom').click(function() {
			$.ajax({
				url: '<?php echo CHtml::normalizeUrl(array("manage/updateRoom")); ?>',
				type: 'post',
				data: {
					action: 'delete',
					roomId: $('#roomId').val()
				},
				success: function(data) {
					alert("success!");
				}
			});
		});

		$('#updateRoom').click(function() {
			$.ajax({
				url: '<?php echo CHtml::normalizeUrl(array("manage/updateRoom")); ?>',
				type: 'post',
				data: {
					action: 'edit',
					roomId: $('#roomId').val(),
					wf_id: $('#wf_id').val(),
				},
				success: function(data) {
					alert(data);
				}
			});
		});
	});
</script>
