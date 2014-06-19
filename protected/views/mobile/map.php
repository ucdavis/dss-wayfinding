<div id="maps">
</div>

<script type="text/javascript">
$(document).ready(function () {
	$.get(
		'<?php echo Yii::App()->baseUrl?>',
		{
			r: 'wayfinding/map',
			startpoint: $('#startpoint').val()
		},
		function(data) {
			$('#maps').html(data);
		}
	);
});
</script>
