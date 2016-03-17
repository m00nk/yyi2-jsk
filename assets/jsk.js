/**
 * @copyright (C) FIT-Media.com,
 * Date: 12/05/12, Time: 8:27 PM
 *
 * @author Dmitrij "m00nk" Sheremetjev <m00nk1975@gmail.com>
 * @package
 */


var jsk = {

	settings: {
		btnOk: 'Ok',
		btnYes: 'Да',
		btnNo: 'Нет',
		btnApply: 'Применить',
		btnUpdate: 'Обновить',
		btnSave: 'Сохранить',
		btnCancel: 'Отмена',
		btnClose: 'Закрыть',
		btnAccept: 'Принять',
		btnDecline: 'Отклонить',

		titleMessage: 'Сообщение',
		titleError: 'Ошибка',
		titleQuestion: 'Вопрос',

		titleConfirm: 'Подтверждение'
	},

	init: function(sets)
	{

		this.settings = $.extend(this.settings, sets || {});

		$('<div id="jskWaitingAnimationCover"></div>').appendTo('body');
		$('<div id="jskWaitingAnimationWrapper"><div id="jskWaitingAnimationBorder"><div id="jskWaitingAnimationImage"></div></div></div>').appendTo('body');
	},

	/**
	 * Создает мини-диалог.
	 *
	 * Внимание! Одновременно может быть создан только один мини-диалог.
	 *
	 * @params html содержимое окна HTML
	 * @params options массив параметров
	 *
	 * Параметры
	 * title : заголовок окна. Если пустая строка, то окно не будет иметь заголовка
	 * windowClasses: класс окна
	 * baseDomObject: базовый DOM-объект. Если задан, то координаты окна будут отсчитываться от этого объекта, иначе - окно появится в центре экрана.
	 * offsetX: смещение в точках по горизонтали от левого верхнего угла базового объекта
	 * offsetY: смещение в точках по вертикали от левого верхнего угла базового объекта
	 * buttons [ {text: "", classes: "", type: "submit|cancel|button|", attributes: ... }, ...] кнопки
	 * autoClose: если TRUE, то клик за пределами диалога будет срабатывать как Cancel (закрывать диалог)
	 *
	 * Закрывается диалог через вызов jsk.miniDialogClose();
	 *
	 * Обработчик на кнопку "OK" вешается с помощью dlg.find('.jsk_js_submit').bind('click', function(e){...});
	 * Обработчик на кнопку "Cancel" вешается с помощью dlg.find('.jsk_js_cancel').bind('click', function(e){...}); но он уже задан по умолчанию,
	 * поэтому, если не требуется каких-либо дополнительных действий при закрытии окна, то создавать и привязывать свой обработчик не нужно.
	 */
	miniDialog: function(html, options)
	{
		options = $.extend({
			title: '',
			windowClasses: '',
			baseDomObject: false,
			offsetX: 0,
			offsetY: 0,
			buttons: [
				{
					text: jsk.settings.btnAccept,
					classes: 'btn btn-sm btn-primary',
					type: 'submit',
					attributes: ''
				},
				{
					text: jsk.settings.btnCancel,
					classes: 'btn btn-sm btn-default',
					type: 'cancel',
					attributes: ''
				}
			],
			autoClose: false

		}, options || {});

		if(options.buttons.length > 0)
		{ // добавляем в код кнопки
			var btnHtml = '';
			for(var i = 0; i < options.buttons.length; i++)
			{
				var btn = options.buttons[i];
				var classes = btn.classes || '';
				var attributes = btn.attributes || '';
				switch(btn.type)
				{
					case 'submit' :
						classes += ' jsk_js_submit';
						break;
					case 'cancel' :
						classes += ' jsk_js_cancel';
						break;
				}

				btnHtml += '<a href="#" class="' + classes + '" ' + attributes + '>' + btn.text + '</a>';
			}

			html += '<div class="jsk_buttons">' + btnHtml + '</div>';
		}

		//-----------------------------------------
		// создаем заголовок
		if(options.title.length)
			html = '<div class="jsk_mini_dlg_title">' + options.title + '</div>' + html;

		//-----------------------------------------
		// отображаем диалог
		var dlg = jsk.waitingMessageShow('<div class="jsk_mini_dialog">' + html + '</div>').addClass(options.windowClasses);
		var dialogContent = dlg.find('.jsk_mini_dialog');

		options.baseDomObject = $(options.baseDomObject);
		var x, y, y1, wnd = $(window);

		if(options.baseDomObject.size() > 0)
		{ // найден базовый объект - позиционируем окно по нему
			var p = options.baseDomObject.offset();

			y = p.top - wnd.scrollTop() - parseInt(dialogContent.outerHeight() / 2) + options.offsetY;
			x = p.left + options.offsetX;

			y1 = y + dialogContent.outerHeight();
			if(y1 > wnd.height()) y -= y1 - wnd.height();

			dlg.css({'padding-top': 0, 'text-align': 'left'});
			dlg.find('#jskWaitingMessage').css({'position': 'relative', 'top': y + 'px', 'left': x + 'px'});
		}
		else
		{ // позиционируем по центру экрана
			y = (wnd.height() - dialogContent.outerHeight()) / 2;
			dlg.css({'padding-top': 0, 'text-align': 'center'});
			dlg.find('#jskWaitingMessage').css({'position': 'relative', 'top': y + 'px'});
		}

		//-----------------------------------------
		// привязка обработчиков
		//-----------------------------------------

		// кнопка типа "cancel" - закрываем окно
		dlg.find('.jsk_js_cancel').bind('click', function(e)
		{
			jsk.miniDialogClose();
			e.preventDefault();
			return true;
		});

		// клик по фону для закрытия диалога (только если autoClose == true)
		if(options.autoClose)
			$('#jskWaitingMessageWrapper').bind('click', function(e)
			{
				var domOb = $(e.target);
				var md = $(domOb.parents('.jsk_mini_dialog')[0]);

				if(md.length == 0)
				{ // клик произошел вне диалога - закрываемся
					jsk.miniDialogClose();
					e.preventDefault();
				}
			});

		//-----------------------------------------
		// клавиши Enter и Escape
		dlg.bind('keydown', function(e)
		{
			if(e.which == 27 /* ESCAPE */)
			{
				dlg.find('.jsk_js_cancel').click();
				e.preventDefault();
				return true;
			}

			if(e.which == 13 /* ENTER */)
			{
				if(!$(e.target).is('textarea'))
				{
					dlg.find('.jsk_js_submit').click();
					e.preventDefault();
				}
				return true;
			}

			return true;
		});

		$(dlg.find(':input')[0]).focus(); // фокусируемся на первом контроле

		return dlg;
	},

	miniDialogClose: function()
	{
		jsk.waitingAnimationHide();
	},

	/**
	 * Отображает глобальный индикатор загрузки. Отключение - jsk.waitingAnimationHide()
	 */
	waitingAnimationShow: function()
	{
		$('#jskWaitingAnimationCover').css('opacity', 0.75).show();
		$('#jskWaitingAnimationWrapper').css('display', 'table-cell').show();
	},

	/**
	 * Прячет глобальный индикатор загрузки
	 */
	waitingAnimationHide: function()
	{
		$('#jskWaitingAnimationCover').hide();
		$('#jskWaitingAnimationWrapper').hide();
		$('#jskWaitingMessageWrapper').remove();
	},

	/**
	 * Возвращает jQuery-объект картинки-индикатора загрузки для вставки в страницу.
	 * Удалить вставленный индикатор можно просто вызвав его метод remove()
	 */
	waitingAnimationGetIcon16: function(){ return $('<div class="jskWaitingAnimationIcon16"></div>'); },
	waitingAnimationGetIcon35: function(){ return $('<div class="jskWaitingAnimationIcon35"></div>'); },
	waitingAnimationGetIconBar: function(){ return $('<div class="jskWaitingAnimationIconBar"></div>'); },
	waitingAnimationGetIconLogo: function(){ return $('<div class="jskWaitingAnimationIconLogo"></div>'); },

	/**
	 * Показывает модальный HTML. Используется для создания глобальных индикаторов работы или диалогов. ъ
	 * @param delta - коэффициент для выравнивания по вертикали.
	 *      Дефолт = 2 (ровно по центру окна). 1 - ровно по нижнему краю. 0 - ровно по верхнему краю. 3 - одна треть пространства сверху и две трети снизу, и т.д.
	 */
	waitingMessageShow: function(html, delta)
	{
		if(typeof delta == 'undefined') delta = 2;

		var dl = $('<div id="jskWaitingMessageWrapper"></div>').css({
			position: 'fixed', top: 0, left: 0,
			width: '100%', height: '100%',
			'z-index': 1110,
			'text-align': 'center',
			'vertical-align': 'middle'
		}).appendTo('body');

		var html = $(html);

		$('<div id="jskWaitingMessage"></div>').append(html).appendTo(dl);

		$('#jskWaitingAnimationCover').css('opacity', 0.75).show();
		$('#jskWaitingMessageWrapper') /*.css('display', 'table-cell') */.show();

		var y, wnd = $(window);

		// позиционируем по центру экрана
		y = (wnd.height() - html.outerHeight()) / delta;
		dl.css({'padding-top': 0, 'text-align': 'center'});
		dl.find('#jskWaitingMessage').css({'position': 'relative', 'top': y + 'px'});

		return dl;
	},

	/**
	 * Применение изменений в странице
	 *
	 * Формат:
	 * [
	 *    {
	 *      selector: jQuery-селектор обрабатываемого элемента
	 *     cmd : команда (add, value, change, replace, remove, addClass, removeClass, addAttr, removeAttr, run, alert
	 *     params: { набор параметров команды }
	 *    },
	 *
	 *    { ... }
	 * ]
	 *
	 */
	applyChanges: function(arr)
	{
		if(arr != undefined)
		{
			// обновляем данные
			for(var i = 0; i < arr.length; i++)
			{
				var item = arr[i];

				var obj = $(item.selector);
				switch(item.cmd)
				{
					case 'add':
						if(item.params.before != undefined) obj.before(item.params.before);
						if(item.params.after != undefined) obj.after(item.params.after);
						if(item.params.append != undefined) obj.append(item.params.append);
						if(item.params.prepend != undefined) obj.prepend(item.params.prepend);
						break;

					case 'value':
						obj.text(item.params);
						break;
					case 'change' :
						obj.html(item.params);
						break;
					case 'replace' :
						obj.after($(item.params)).remove();
						break;
					case 'remove' :
						obj.remove();
						break;

					case 'addClass':
						obj.addClass(item.params);
						break;
					case 'removeClass':
						obj.removeClass(item.params);
						break;
					case 'replaceClass':
						obj.removeAttr('class').addClass(item.params);
						break;

					case 'addAttr' :
						obj.attr(item.params.name, item.params.value);
						break;
					case 'removeAttr' :
						obj.removeAttr(item.params);
						break;

					case 'run' :
						for(var j = 0; j < item.params.length; j++)
						{ eval(item.params[j]); }
						break;

					case 'alert':
						this.messageBox(item.params.message, item.params.title, item.params.width);
						break;

					case 'dialog':
						this.dialog(item.params.id, item.params.content, item.params.title, item.params.options);
						break;
				}
			}
		}
	},

	dialog: function(id, content, title, options)
	{
		var d = $('<div id="' + id + '">' + content + '</div>').appendTo($('body'));

		options = $.extend({
			title: title || '',
			resizable: false,
			modal: true,
			closeOnEscape: false,
			close: function(){ $(this).dialog('destroy').remove();}
		}, options || {});

		d.dialog(options);

		return d;
	},

	/**
	 * Создает диалог из уже имеющегося на странице DIVа
	 */
	dialogByDiv: function(divId, options)
	{
		var d = $('#' + divId);

		options = $.extend({
			title: d.attr('data-title') || '',
			resizable: false,
			modal: true,
			closeOnEscape: false,
			close: function(){ $(this).dialog('destroy');}
		}, options || {});

		d.dialog(options);

		return d;
	},

	/**
	 * Показывает модальный диалог-сообщение и возвращает его объект.
	 * Удаление - закрытие диалога или вызов .dialog("close") объекта.
	 *
	 * @param message - текст сообщения (HTML)
	 * @param title - заголовок сообщения (не обязателен)
	 * @param width - ширина окна (не обязательна)
	 * @param dialogClass - дополнительный класс окна диалога (dlg_success, dlg_info, dlg_danger, dlg_error)
	 */
	messageBox: function(message, title, width, dialogClass)
	{
		var d = $('<div></div>').appendTo($('body'));
		d.html(message);

		var options = {
			title: title || jsk.settings.titleMessage,
			resizable: false,
			dialogClass: dialogClass || '',
			modal: true,
			closeOnEscape: true,
			close: function(){ $(this).remove(); },
			buttons: [
				{text: jsk.settings.btnClose, click: function(){ $(this).dialog("close"); }}
			]
		};

		if((width || false) !== false) options['width'] = width;

		d.dialog(options);
	},

	/**
	 * Выводит окно с вопросом
	 *
	 * @param message - текст сообщения (HTML)
	 * @param title - заголовок окна
	 * @param onOk - функция, которая будет вызвана при нажатии ОК, определение: function(dlg, data)
	 * @param data - данные, которые будут переданы в функцию
	 * @param dialogClass - дополнительный класс окна диалога
	 */
	confirm: function(message, title, onOk, data, dialogClass)
	{
		var d = $('<div></div>').appendTo($('body'));
		d.html(message);

		var options = {
			title: title || jsk.settings.titleQuestion,
			resizable: false,
			modal: true,
			dialogClass: dialogClass || '',
			closeOnEscape: true,
			close: function(){ $(this).remove(); },
			buttons: [
				{
					text: jsk.settings.btnYes,
					click: function()
					{
						if(typeof onOk != 'undefined') onOk(this, data);
						$(this).dialog("close");
					}
				},
				{text: jsk.settings.btnNo, click: function(){$(this).dialog("close");}}
			]
		};

		d.dialog(options);
	},

	/**
	 * Метод отображает модальное сообщение и возвращает его объект. Удаление - вызов remove() объекта.
	 *
	 * @param message - текст сообщения (HTML)
	 * @param className - дополнительное имя класса для div.alert (варианты: alert-success, alert-info, alert-warning, alert-danger)
	 */
	modalAlertShow: function(message, className)
	{
		className = (className) || 'alert-info';
		return jsk.waitingMessageShow('<div class="alert ' + className + '">' + message + '</div>');
	},

	/**
	 * Открывает указанный URL в новой вкладке броузера
	 */
	openLinkInNewTab: function(url)
	{
		window.open(url, '_blank')
	},

	/** из контролов формы создает массив, пригодный для пересылки постом (для аякс-запросов) */
	formToArray: function(formSelector)
	{
		var p, name, data = {};

		jQuery.each($(formSelector).serializeArray(), function()
		{
			var p, arr, name = this.name;
			p = name.search(/\[\]/);
			if(p != -1)
			{ // поле с множественным выбором типа SomeClass[SomeField][]
				name = name.substring(0, name.length - 2);

				p = name.search(/\[/);
				if(p == -1)
					data[name] = this.value;
				else
				{
					arr = name.match(/(.*)\[(.*)\]/);
					if(typeof data[arr[1]] == 'undefined') data[arr[1]] = {};

					if(typeof data[arr[1]][arr[2]] == 'undefined')
						data[arr[1]][arr[2]] = this.value;
					else
						data[arr[1]][arr[2]] += ',' + this.value; // собираем массив значений
				}
			}
			else
			{
				p = name.search(/\[/);
				if(p == -1)
					data[name] = this.value;
				else
				{
					arr = name.match(/(.*)\[(.*)\]/);
					if(typeof data[arr[1]] == 'undefined') data[arr[1]] = {};

					data[arr[1]][arr[2]] = this.value;
				}
			}
		});
		return data;
	},

	urlEncode: function(str)
	{
		str = (str + '').toString();

		// Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
		// PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
		return encodeURIComponent(str)
			.replace(/!/g, '%21')
			.replace(/'/g, '%27')
			.replace(/\(/g, '%28')
			.replace(/\)/g, '%29')
			.replace(/\*/g, '%2A')
			.replace(/%20/g, '+');
	},

	/**
	 * Возвращает jQuery-объект типа type, являющийся base или его родителей.
	 * Пример:
	 *   var link = jsk.getDomObject(e.target, 'a.activator');
	 */
	getDomObject: function(base, type)
	{
		var o = $(base);
		if(!o.is(type)) o = $(o.parents(type)[0]);
		return o;
	},

	/** Дамп объекта */
	var_dump: function(obj)
	{
		function _vd(obj)
		{
			var out = '';
			if(obj && typeof(obj) == "object")
			{
				for(var i in obj)
				{
					if(obj.hasOwnProperty(i))
					{
						if(typeof obj[i] == 'object')
							out += '<li><b>' + i + ' =</b>  [' + _vd(obj[i]) + ']</li>';
						else
							out += '<li><b>' + i + ' =</b> [' + obj[i] + ']</li>';
					}
				}
			}
			else
				return obj;
			return out != '' ? '<ul>' + out + '</ul>' : '';
		}

		this.messageBox(_vd(obj), 'Dump');
	},

	/**
	 * Strip whitespace (or other characters) from the beginning of a string
	 *
	 * original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	 * input by: Erkekjetter
	 * improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	 */
	ltrim: function(str, charlist)
	{
		charlist = !charlist ? ' \\s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
		var re = new RegExp('^[' + charlist + ']+', 'g');
		return str.replace(re, '');
	},

	/**
	 * Возвращает массив элементов из массива a1, которые отсутствуют в массиве a2
	 */
	arrayDiff: function(a1, a2)
	{
		return $(a1).not(a2).get();
		//var out = [], found;
		//
		//for(var i=0,_c=a1.length; i < _c; i++)
		//{
		//	found = false;
		//	for(var j=0,_cc=a2.length; j < _cc; j++)
		//		if(a1[i] == a2[j]) { found = true; break; }
		//
		//	if(!found) out.push(a1[i]);
		//}
		//return out;
	},

	/**
	 * Ищет значение needle в массиве haystack и возвращает ключ, если найдено. Если искомое значение отсутствует - вернет false
	 * Примечание: для массивов с числовыми индексами лучше использовать jQuery.inArray(val, array, [fromIndex])
	 * Если параметр strict == TRUE, то будут проверяться не только значения, но и типы. Если FALSE (или не задан), то только значения.
	 */
	arraySearch: function(value, arr, strict)
	{
		if(typeof strict == 'undefined') strict = false;
		for(var key in arr)
			if((strict && arr[key] === value) || (!strict && arr[key] == value))
				return key;

		return false;
	},

	/**
	 * Замена подстроки
	 */
	strReplace: function(str, from, to)
	{
		return str.replace(new RegExp(from, 'gi'), to); // gi = Global and case-Insensitive
	},

	/**
	 * Красивая замена стандартному алерту. Документация: http://t4t5.github.io/sweetalert/
	 *
	 * @param message текст сообщения
	 * @param title заголовок сообщения
	 * @param type тип ("warning", "error", "success", "info"). Не обязательное.
	 * @param options дополнительные опции, описание: http://t4t5.github.io/sweetalert/. Не обязательное.
	 * @param func функция-обработчик реакции пользователя. Не обязательное.
	 * Если в функции открывается еще один алерт, то чтобы не произошло авто-закрытия, главному алерту нужно передать опцию closeOnConfirm = false
	 */
	sweetAlert: function(message, title, type, options, func)
	{
		var _defaultOptions = {
			title: title,
			text: message,
			type: type
		};

		var opt = $.extend(_defaultOptions, options || {});

		swal(opt, func);
	},

	/**
	 * Определяет, видим ли переданный элемент на странице и, если не видим, то прокручивает страницу так, чтобы элемент стал видимым
	 *
	 * @param el jQuery-объект
	 * @param delta размер отступа в пикселах (по-умолчанию 16)
	 */
	scrollToElement: function(el, delta)
	{
		if(typeof delta == 'undefined') delta = 16;

		var screenTop = $(window).scrollTop();
		var screenBottom = screenTop + $(window).height();
		var elTop = el.position().top;
		var elBottom = elTop + el.height();

		if(screenTop > elTop)
		{ // элемент выше
			$(window).scrollTop(screenTop - elTop - delta);
		}

		if(screenBottom < elBottom)
		{ // элемент ниже
			$(window).scrollTop(screenTop + elBottom - screenBottom + delta);
		}
	},

	/**
	 * Преобразует число (целое или дробное) в денежный формат (типа $ 1,234,517.00)
	 *
	 * @param n число
	 * @param thousandSeparator разделитель тысяч
	 * @param prevCurrency знак валюты (добавится перед числом), не обязателен
	 * @param postCurrency знак валюты (добавится после числа), не обязателен
	 * @returns {string}
	 */
	currencyFormat: function(n, thousandSeparator, prevCurrency)
	{
		prevCurrency = (typeof prevCurrency == 'undefined') ? '' : prevCurrency + ' ';
		postCurrency = (typeof postCurrency == 'undefined') ? '' : postCurrency + ' ';

		return prevCurrency + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1" + thousandSeparator) + postCurrency;
	},

	/**
	 * Возвращает смещение текущего часового поясас от UTC в минутах.
	 *
	 * @returns {number}
	 */
	getTimeZoneOffset: function()
	{
		var date = new Date();
		return -date.getTimezoneOffset();
	},

	/**
	 * Проверяет, используют ли в текущем часовом поясе переход на летнее время (булево значение)
	 * Источник: http://stackoverflow.com/a/26778394
	 */
	isDst: function()
	{
		Date.prototype.stdTimezoneOffset = function()
		{
			var fy = this.getFullYear();
			if(!Date.prototype.stdTimezoneOffset.cache.hasOwnProperty(fy))
			{

				var maxOffset = new Date(fy, 0, 1).getTimezoneOffset();
				var monthsTestOrder = [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1];

				for(var mi = 0; mi < 12; mi++)
				{
					var offset = new Date(fy, monthsTestOrder[mi], 1).getTimezoneOffset();
					if(offset != maxOffset)
					{
						maxOffset = Math.max(maxOffset, offset);
						break;
					}
				}
				Date.prototype.stdTimezoneOffset.cache[fy] = maxOffset;
			}
			return Date.prototype.stdTimezoneOffset.cache[fy];
		};

		Date.prototype.stdTimezoneOffset.cache = {};

		Date.prototype.isDST = function()
		{
			return this.getTimezoneOffset() < this.stdTimezoneOffset();
		};

		return new Date().isDST();
	}
};
