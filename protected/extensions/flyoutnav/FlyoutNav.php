class FlyoutNav extends CWidget
{
    public function init() {
        ob_start();
    }

    public function run() {
        $contents = ob_get_contents();
        ob_end_clean();
    }
}
