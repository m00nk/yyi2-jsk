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

class SweetAlertAsset extends AssetBundle
{
	public $sourcePath = '@bower/sweetalert';

	public $css = [
		'dist/sweetalert.css',
	];

	public $js = [
		'dist/sweetalert.min.js',
	];

	public $publishOptions = [
		'forceCopy' => YII_ENV_DEV
	];
}