/**
 * @copyright (C) FIT-Media.com, {@link http://tanitacms.net}
 * Date: 12/05/12, Time: 8:27 PM
 *
 * @author Dmitrij "m00nk" Sheremetjev <m00nk1975@gmail.com>
 * @package
 */


var jsk = {

	settings: {
		urlAssets: '',
		urlAjax: '',
		btnOk: 'Ok',
		btnYes: 'Да',
		btnNo: 'Нет',
		btnApply : 'Применить',
		btnUpdate : 'Обновить',
		btnSave : 'Сохранить',
		btnCancel : 'Отмена',
		btnClose : 'Закрыть',
		btnAccept : 'Принять',
		btnDecline : 'Отклонить',

		titleMessage: 'Сообщение',
		titleError: 'Ошибка',
		titleQuestion: 'Вопрос',

		titleConfirm: 'Подтверждение'
	},

	init: function(sets)
	{
		this.settings = $.extend(this.settings, sets || {});

		var imgFileUrl = this.settings.urlAssets + '/ani-logo.gif';
		$('<div id="jskWaitingAnimationCover"></div>').appendTo('body');
		$('<div id="jskWaitingAnimationWrapper"><div id="jskWaitingAnimationBorder"><img src="' + imgFileUrl + '" /></div></div>').appendTo('body');
		$('<img  id="jskWaitingAnimationImage" src="' + imgFileUrl + '" />').appendTo('body');

	},

	/**
	 * Возвращает jQuery-объект картинки-индикатора загрузки для вставки в страницу.
	 * Удалить вставленный индикатор можно просто вызвав его метод remove()
	 */
	waitingAnimationGetIcon16: function(){ return $('<img class="jskWaitingAnimationIcon16" src="' + this.settings.urlAssets + '/ani-16.gif" />'); },
	waitingAnimationGetIcon35: function(){ return $('<img class="jskWaitingAnimationIcon35" src="' + this.settings.urlAssets + '/ani-35.gif" />'); },
	waitingAnimationGetIconBar: function(){ return $('<img class="jskWaitingAnimationIconBar" src="' + this.settings.urlAssets + '/ani-bar.gif" />'); },
	waitingAnimationGetIconLogo: function(){ return $('<img class="jskWaitingAnimationIconLogo" src="' + this.settings.urlAssets + '/ani-logo.gif" />'); },

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
	 * Показывает глобальный индикатор загрузки, но используя HTML вместо картинки
	 */
	waitingMessageShow: function(html)
	{
		var d1 = $('<div id="jskWaitingMessageWrapper"></div>').css({
			position: 'fixed', top: 0, left: 0,
			width: '100%', height: '100%',
			'z-index': 101,
			'text-align': 'center',
			'vertical-align': 'middle',
			'padding-top': '300px'
		}).appendTo('body');

		$('<div id="jskWaitingMessage">' + html + '</div>').appendTo(d1);
		$('#jskWaitingAnimationCover').css('opacity', 0.75).show();
		$('#jskWaitingMessageWrapper').css('display', 'table-cell').show();

		return d1;
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
		var d = $('#'+divId);

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
				{ text: jsk.settings.btnClose, click: function(){ $(this).dialog("close"); } }
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
				{ text: jsk.settings.btnYes,
					click: function()
					{
						if(typeof onOk != 'undefined') onOk(this, data);
						$(this).dialog("close");
					}
				},
				{ text: jsk.settings.btnNo, click: function(){$(this).dialog("close");}}
			]
		};

		d.dialog(options);
	},

	/**
	 * Метод отображает модальное сообщение и возвращает его объект. Удаление - вызов remove() объекта.
	 *
	 * @param message - текст сообщения (HTML)
	 * @param className - дополнительное имя класса для div.alert
	 */
	modalAlertShow: function(message, className)
	{
		var d = $('<div></div>').css({
			'position': 'fixed',
			'top': 0,
			'left': 0,
			'width': '100%',
			'height': '100%',
			'z-index': 100
		}).appendTo($('body'));

		$('<div></div>').css({
			'position': 'fixed',
			'top': 0,
			'left': 0,
			'width': '100%',
			'height': '100%',
			'background': '#888',
			'opacity': '0.85'
		}).appendTo(d);

		var alert = $('<div class="alert ' + className + '"></div>').html(message).css({
			'position': 'fixed',
			'left': 0,
			'width': '500px',
			'font-size': '140%',
			'padding': '30px'
		}).appendTo(d);

		var h = alert.height();
		var x = parseInt(($(window).width() - alert.width()) / 2);
		var y = parseInt(($(window).height() - h) / 2) - 100;

		alert.css({
			'left': x + 'px',
			'top': y + 'px'
		});

		return d;
	},

	openLinkInNewTab: function(url)
	{
		window.open(url , '_blank')
	},

	/** из контролов формы создает массив, пригодный для пересылки постом (для аякс-запросов) */
	formToArray: function(formSelector)
	{
		var p, name, data = {};

		jQuery.each($(formSelector).serializeArray(), function(){
			var p, arr, name = this.name;
			p = name.search(/\[\]/);
			if(p != -1)
			{ // поле с множественным выбором типа SomeClass[SomeField][]
				name = name.substring(0, name.length-2);

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
						data[arr[1]][arr[2]] += ','+this.value; // собираем массив значений
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
		    .
		  replace(/\)/g, '%29')
		    .replace(/\*/g, '%2A')
		    .replace(/%20/g, '+');
	},

	/**
	 * Возвращает jQuery-объект типа type, являющийся base или его родителей.
	 * Пример:
	 *   var link = jsk.getDomObject(e.target, 'a.activator');
	 */
	getDomObject: function(base, type){
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
							out += '<li><b>'+i+' =</b>  ['+_vd(obj[i])+']</li>';
						else
							out += '<li><b>'+i+' =</b> ['+obj[i]+']</li>';
					}
				}
			}
			else
				return obj;
			return out != '' ? '<ul>'+out+'</ul>' : '';
		}

		this.messageBox(_vd(obj), 'Dump');
	},

	/**
	 * Создает мини-диалог
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
	 *
	 * Закрывается диалог через вызов jsk.waitingAnimationHide();
	 *
	 * Обработчик на кнопку "OK" вешается с помощью dlg.find('.jsk_js_submit').bind('click', function(e){...});
	 * Обработчик на кнопку "Cancel" вешается с помощью dlg.find('.jsk_js_cancel').bind('click', function(e){...}); но он уже задан по умолчанию,
	 * поэтому, если не требуется каких-либо дополнительных действий при закрытии окна, то создавать и привязывать свой обработчик не нужно.
	 */
	miniDialog: function(html, options)
	{
		options = $.extend({
			title : '',
			windowClasses: '',
			baseDomObject: false,
			offsetX : 0,
			offsetY : 0,
			buttons : [
				{
					text : jsk.settings.btnAccept,
					classes: 'btn btn-small btn-primary',
					type: 'submit',
					attributes : ''
				},
				{
					text : jsk.settings.btnCancel,
					classes: 'btn btn-small',
					type: 'cancel',
					attributes : ''
				}
			]
		}, options || {});


		if(options.buttons.length > 0)
		{ // добавляем в код кнопки
			var btnHtml = '';
			for(var i=0; i<options.buttons.length; i++)
			{
				var btn = options.buttons[i];
				var classes = btn.classes || '';
				var attributes = btn.attributes || '';
				switch(btn.type)
				{
					case 'submit' : classes += ' jsk_js_submit'; break;
					case 'cancel' : classes += ' jsk_js_cancel'; break;
				}

				btnHtml += '<a href="#" class="'+classes+'" '+attributes+'>'+btn.text+'</a>';
			}

			html += '<div class="jsk_buttons">'+btnHtml + '</div>';
		}

		//-----------------------------------------
		// создаем заголовок
		if(options.title.length)
			html = '<div class="jsk_mini_dlg_title">'+options.title+'</div>' + html;

		//-----------------------------------------
		// отображаем диалог
		var dlg = jsk.waitingMessageShow('<div class="jsk_mini_dialog">'+html+'</div>').addClass(options.windowClasses);
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
			y = (wnd.height() - dialogContent.outerHeight())/2;
			dlg.css({'padding-top': 0, 'text-align': 'center'});
			dlg.find('#jskWaitingMessage').css({'position': 'relative', 'top': y + 'px'});
		}

		//-----------------------------------------
		// привязка обработчиков
		//-----------------------------------------

		// кнопка типа "cancel" - закрываем окно
		dlg.find('.jsk_js_cancel').bind('click', function(e){
			jsk.waitingAnimationHide();
			e.preventDefault();
			return true;
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
	arrayDiff : function(a1, a2)
	{
		var out = [], found;

		for(var i=0,_c=a1.length; i < _c; i++)
		{
			found = false;
			for(var j=0,_cc=a2.length; j < _cc; j++)
				if(a1[i] == a2[j]) { found = true; break; }

			if(!found) out.push(a1[i]);
		}
		return out;
	},

	/**
	 * Ищет значение needle в массиве haystack и возвращает ключ, если найдено. Если искомое значение отсутствует - вернет false
	 * Примечание: для массивов с числовыми индексами лучше использовать jQuery.inArray(val, array, [fromIndex])
	 */
	arraySearch: function (value, arr)
	{
		for(var key in arr)
			if( (strict && arr[key] === value) || (!strict && arr[key] == value) )
				return key;

		return false;
	},

	/**
	 * Замена подстроки
 	 */
	strReplace : function(str, from, to)
	{
		return str.replace(new RegExp(from,'gi'), to); // gi = Global and case-Insensitive
	}


};
