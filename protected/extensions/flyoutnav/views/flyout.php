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
        $('#flyout-nav').flyout({<?php
            if (isset($radius)) echo "radius : '$radius',";
            if (isset($totalDegrees)) echo "totalDegrees : '$totalDegrees',";
            if (isset($offsetx)) echo "offsetx : '$offsetx',";
            if (isset($offsety)) echo "offsety : '$offsety',";
            if (isset($angleOffset)) echo "angleOffset : '$angleOffset',";
            if (isset($duration)) echo "duration : '$duration',";
            if (isset($delay)) echo "delay : '$delay',";
            if (isset($startRotation)) echo "startRotation: '$startRotation',";
            if (isset($endRotation)) echo "endRotation: '$endRotation',";
            if (isset($flyoutSizePercent)) echo "flyoutSizePercent: '$flyoutSizePercent',";
            if (isset($reverseOut)) echo "reverseOut: '$reverseOut',";
            if (isset($reverseIn)) echo "reverseIn: '$reverseIn',";
            if (isset($modalBGColor)) echo "modalBGColor: '$modalBGColor',";
            if (isset($hardcoreMode)) echo "hardcoreMode: '$hardcoreMode',";
        ?>});
    });
</script>
