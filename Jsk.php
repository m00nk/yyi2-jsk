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
	public function init()
	{
		parent::init();
		$this->registerAssets();

	}

	public function run()
	{

	}

	protected function registerAssets()
	{
		JskAsset::register($this->getView());

//		$this->registerPluginOptions('growl');
//		$js = '$.growl('.Json::encode($this->_settings).', '.$this->_hashVar.');';
//		if(!empty($this->delay) && $this->delay > 0)
//		{
//			$js = 'setTimeout(function () {'.$js.'}, '.$this->delay.');';
//		}
//		$view->registerJs($js);
	}

}