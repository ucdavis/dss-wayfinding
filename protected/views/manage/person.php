<?php
/* @var $this SiteController */
	$this->pageTitle=Yii::app()->name;
?>
<h1>LCD Screen Management</h1>
<h2>Person Management</h2>
<?php if (isset($success) && $success) { ?>
<span>Success! Wayfinding Updated</span>
<br /><br />
<?php } ?>
<?php if (isset($error) && $error) { ?>
<span><?php echo $error; ?></span>
<br /><br />
<?php } ?>
<input type="text" id="personSearch" class="ui-autocomlete">
<input type="hidden" id="personId" value="">
<input type="button" value="Edit" id="edit">
<br /><br />
<input type="button" value="Add New Person" id="add">

<script type="text/javascript">
	$(document).ready(function () {
		//initialize autocomplete functionality for searching people.
		$('#personSearch').autocomplete({
			autoFocus: true,
			source: [
			<?php foreach ($people as $person) {
				echo '{ label: "' . $person['lastname'] . ', ' . $person['firstname']
					 . '", value:' . $person['person_id'] . '},';
			}
			?>],
			delay: 500,
			select: function(event, person) {
				event.preventDefault();
				$('#personSearch').val(person.item.label);
				$('#personId').val(person.item.value);
			},
			focus: function(event, person) {
				event.preventDefault();
				$('#personId').val(person.item.value);
			},
			messages: {
				results: '',
				noResults: ''
			}
		});

		//prepare edit button action
		$('#edit').click(function() {
			location.href = 'index.php?r=manage/personForm&person=' + $('#personId').val();
		});

		//prepare edit button action
		$('#add').click(function() {
			location.href = 'index.php?r=manage/personForm';
		});
	});
</script>
