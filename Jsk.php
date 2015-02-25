<?php
/**
 * @copyright (C) FIT-Media.com (fit-media.com), {@link http://tanitacms.net}
 * Date: 22.02.15, Time: 14:26
 *
 * @author Dmitrij "m00nk" Sheremetjev <m00nk1975@gmail.com>
 * @package
 */

namespace m00nk\jsk;

/**
 * Class Jsk
 */
class Jsk extends \yii\base\Widget
{
	public function run()
	{
		$view = $this->getView();
		JskAsset::register($view);

		$view->registerJs('jsk.init();');
	}
}