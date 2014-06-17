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
