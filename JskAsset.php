<?php
/**
 * @copyright (C) FIT-Media.com (fit-media.com), {@link http://tanitacms.net}
 * Date: 22.02.15, Time: 14:34
 *
 * @author Dmitrij "m00nk" Sheremetjev <m00nk1975@gmail.com>
 * @package
 */

namespace m00nk\jsk;
use yii\web\AssetBundle;

class JskAsset extends AssetBundle
{
	public $css = [
		'jsk.css',
	];

	public $js = [
		'jsk.js'
	];

	public $depends = [
		'yii\web\JqueryAsset',
		'yii\bootstrap\BootstrapAsset',
	];

	public function init()
	{
		$this->sourcePath = __DIR__.'/assets';
		parent::init();
	}

}