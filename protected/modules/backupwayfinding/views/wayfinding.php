<div id="mapLoading">
    <?php
        echo CHtml::image(Yii::App()->request->baseUrl . '/images/loading.gif');
    ?>
</div>
<div id="myMaps"></div>
<script type="text/javascript">
    $('#myMaps').wayfinding({
        <?php
            echo "'maps': [\n";
            foreach($maps as $index => $map) {
                echo "{'path': '$map', 'id': 'floor$index'},\n";
            }
            echo "],\n";
            if (isset($options->path)) {
                echo "path: {\n";
                foreach ($options->path as $key => $value) {
                    echo "\t$key: '$value',\n";
                }
                echo "},\n";
            }
            echo "'startpoint': '$startpoint'\n";
        ?>
    });
</script>
