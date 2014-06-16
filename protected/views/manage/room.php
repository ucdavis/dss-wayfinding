<?php
/* @var $this SiteController */
	$this->pageTitle=Yii::app()->name;
?>
<h1>LCD Screen Management</h1>
<h2>Room Management</h2>
<?php if (isset($success) && $success) { ?>
<span>Success! Wayfinding Updated</span>
<br /><br />
<?php } ?>
<?php if (isset($error) && $error) { ?>
<span><?php echo $error; ?></span>
<br /><br />
<?php } ?>
<input type="text" id="roomSearch" class="ui-autocomlete">
<input type="hidden" id="roomId" value="">
<input type="button" value="Edit" id="edit">
<br /><br />
<input type="button" value="Add New room" id="add">

<script type="text/javascript">
	$(document).ready(function () {
		//initialize autocomplete functionality for searching rooms.
		$('#roomSearch').autocomplete({
			autoFocus: true,
			source: [
			<?php foreach ($rooms as $room) {
				echo '{ label: "' . $room['wf_id']
					 . '", value:' . $room['room_id'] . '},';
			}
			?>],
			delay: 500,
			select: function(event, room) {
				event.preventDefault();
				$('#roomSearch').val(room.item.label);
				$('#roomId').val(room.item.value);
			},
			focus: function(event, room) {
				event.preventDefault();
				$('#roomId').val(room.item.value);
			},
			messages: {
				results: '',
				noResults: ''
			}
		});

		//prepare edit button action
		$('#edit').click(function() {
			location.href = 'index.php?r=manage/roomForm&room=' + $('#roomId').val();
		});

		//prepare edit button action
		$('#add').click(function() {
			location.href = 'index.php?r=manage/roomForm';
		});
	});
</script>
