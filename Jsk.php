<?php
/**
 * @copyright (C) FIT-Media.com (fit-media.com), {@link http://tanitacms.net}
 * Date: 22.02.15, Time: 14:26
 *
 * @author Dmitrij "m00nk" Sheremetjev <m00nk1975@gmail.com>
 * @package
 */

namespace m00nk\jsk;

use yii\helpers\Json;

class Jsk extends \yii\base\Widget
{
	public $language = false;

	public function run()
	{
		$view = $this->getView();

		JskAsset::register($view);

		if($this->language === false) $this->language = \Yii::$app->language;

		$opts = [];

		if($this->language != 'ru')
			$opts = [
				'btnOk'=> 'Ok',
				'btnYes'=> 'Yes',
				'btnNo'=> 'No',
				'btnApply' => 'Apply',
				'btnUpdate' => 'Update',
				'btnSave' => 'Save',
				'btnCancel' => 'Cancel',
				'btnClose' => 'Close',
				'btnAccept' => 'Accept',
				'btnDecline' => 'Decline',

				'titleMessage'=> 'Message',
				'titleError'=> 'Error',
				'titleQuestion'=> 'Question',

				'titleConfirm'=> 'Confirm'
			];

		$view->registerJs('jsk.init('.Json::encode($opts).');');
	}
}