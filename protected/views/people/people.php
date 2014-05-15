<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name;
?>
<div class="secondaryNav">
	<div id="box">
		<select>
			<option>Economics</option>
			<option>History</option>
			<option>Philosophy</option>
			<option>Staff</option>
			<option selected>All People</option>
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
