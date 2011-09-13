/*
 * jQuery UI Selectgroup @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Depends:
 * jquery.ui.core.js
 * jquery.ui.widget.js
 */
(function($, undefined) {
	$.widget('ui.selectgroup', {
		version: '@VERSION',
		options: {
			placeholder: false
		},
		isOpen: false,
		_create: function() {
			var self = this, 
				options = this.options;
			if ($.ui.selectgroup.group.initialised === false) {
				$('body').append($.ui.selectgroup.group);
				$.ui.selectgroup.group.hide();
			}
			$.ui.selectgroup.group.initialised = true;
			this.placeholder = $('<a href="#" class="' + self.widgetBaseClass + ' ui-widget ui-state-default ui-corner-all"'
				+ 'role="button" aria-haspopup="true" aria-owns="">'
				+ '<span class="">Placeholder text</span>'
				+ '<span class=""></span></a>');
			$(this.element).after(this.placeholder);
			$(this.element).hide();
			this.placeholder.bind('click.selectgroup', function(event) {
				event.preventDefault();
				if ($.ui.selectgroup.group.past !== null) {
					if ($.ui.selectgroup.group.past.element !== self.element) {
						self.close();
					}
				}
				if (!self.isOpen) {
					self.open();
				} 
				else {
					self.close();
				}
				$.ui.selectgroup.group.past = self;
			});
		},
		_init: function() {

		},
		_index: function() {
			this.selectors = $.map($('option', this.element), function(value) {
				return {
					text: $(value).text(),
					optgroup: $(value).parent('optgroup')
				};
			});
			this._build();
		},
		_build: function() {
			var self = this, 
				options = this.options;
			this.group = $('<ul class="' + self.widgetBaseClass + '-list"></ul>');
			$.each(this.selectors, function() {
				var list = '<li class="' + self.widgetBaseClass + '-item"><a href="#">'+ this.text +'</a></li>'
				if (this.optgroup.length) {
					var name = self.widgetBaseClass + '-optgroup-' + self.element.find('optgroup').index(this.optgroup);
					if (self.group.find('li.' + name).length ) {
						self.group.find('li.' + name + ' ul').append($(list));
					}
					else {
						var opt = '<li class="' + name + '"><span>'+ this.optgroup.attr('label') +'</span><ul>'+ list +'</ul></li>'
						$(opt).appendTo(self.group)
					}
				}
				else {
					$(list).appendTo(self.group);
				}
			});
			$($.ui.selectgroup.group).html(this.group);
			this._position();
		},
		_position: function() {
			var coordinates = this.placeholder.offset();
			coordinates.top += this.placeholder.height();
			$($.ui.selectgroup.group).css({'top': coordinates.top, 'left': coordinates.left});
		},
		destroy: function() {

		},
		enable: function() {

		},
		disable: function() {

		},
		open: function() {
			this._index();
			this.placeholder.addClass('ui-state-active');
			$.ui.selectgroup.group.show();
			this.isOpen = true;
		},
		close: function() {
			$.ui.selectgroup.group.hide();
			$.ui.selectgroup.group.past.placeholder.removeClass('ui-state-active');
			this.placeholder.removeClass('ui-state-active');
			this.isOpen = false;
		}
	})
	$.ui.selectgroup.group = $('<div class="ui-selectgroup-group ui-widget ui-widget-content ui-corner-bottom"></div>');
	$.ui.selectgroup.group.initialised = false;
	$.ui.selectgroup.group.past = null;
})(jQuery);