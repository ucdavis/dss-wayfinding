<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name;
?>
<div class="secondaryNav">
	<div id="box">
		<select>
			<?php
			foreach($depts as $dept) {
				echo "<option value='$dept'>$dept</option>";
			}
			?>
			<option value="all" selected>All</option>
		</select>
		<?php
			echo CHtml::image(Yii::App()->request->baseUrl . '/images/DownTriangle.svg',
				'Expand Dropdown',
				array(
					'id' => 'dropdown-button'
				)
			);
		?>
	</div>
</div>
<?php
foreach ($peopleInfo as $person) {
?>
<div class="card">
	<?php
	echo "<input type='hidden' id='personId' value='" . $person['person']->person_id . "'>";
	foreach ($person['depts'] as $dept) {
		echo "<input type='hidden' value='$dept'>";
	}
	echo "<b>";
	echo $person['person']->lastname . ', ' . $person['person']->firstname;
	echo "</b><br />";
	echo $person['person']->email;
	?>
</div>
<?php
}
?>
<script type="text/javascript">
	$('#box > select').change(function (event) {
		var dept = $(this).val();

		if (dept == "all") {
			$('.card').show();
		} else {
			$('.card').hide();
			$('.card:has(input[value="' + dept + '"])').show();
		}
	});

	$('.card').click(function (event) {
		var personId = $('#personId', this).val();
		$.get(
			'<?php echo CHtml::normalizeUrl(array('people/person')); ?>',
			{
				personId: personId
			},
			function(data) {
				$('#content').html(data);
			}
		);
	});
</script>
