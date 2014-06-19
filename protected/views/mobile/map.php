<div id="maps">
</div>

<script type="text/javascript">
$(document).ready(function () {
	$.get(
		'<?php echo Yii::App()->baseUrl?>',
		{
			r: 'wayfinding/map',
			startpoint: $('#startpoint').val(),
			mobile: true
		},
		function(data) {
			$('#maps').html(data);
		}
	);
});
</script>
