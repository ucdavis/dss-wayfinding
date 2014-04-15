<ul id="flyout-nav">
<?php
    foreach ($this->list as $item) {
        echo '<li>'.$item.'</li>';
    }
    echo '<li id="mainButton">'.$this->mainButton.'</li>';
?>
</ul>
<script type="text/javascript">
    $(document).ready(function(){
        $('#flyout-nav').flyout({radius: '100', 'duration':'200'});
    });
</script>
