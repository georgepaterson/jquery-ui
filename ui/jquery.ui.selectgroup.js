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
			this.menu = $('<div class="ui-selectgroup-group"></div>');
			$('body').append(this.menu);
			this.placeholder = $('<a href="#" class="ui-selectgroup ui-widget ui-state-default ui-corner-all"'
				+ 'role="button" aria-haspopup="true" aria-owns="">'
				+ '<span class="">Placeholder text</span>'
				+ '<span class=""></span></a>');
			$(this.element).after(this.placeholder);
			$(this.element).hide();
			this.placeholder.bind('click', function(event) {
				event.preventDefault();
				if (!self.isOpen) {
					self.open();
				}
				else {
					self.close();
				}
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
			this.group = $('<ul class="ui-selectgroup-list"></ul>');
			$.each(this.selectors, function() {
				var list = '<li class="ui-selectgroup-item"><a href="#">'+ this.text +'</a></li>'
				if (this.optgroup.length) {
					var name = 'ui-selectgroup-optgroup-' + self.element.find('optgroup').index(this.optgroup);
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
			$(this.menu).html(this.group);
		},
		destroy: function() {

		},
		enable: function() {

		},
		disable: function() {

		},
		open: function() {

			this._index();
			this.menu.show();
			this.isOpen = true;
		},
		close: function() {
			
			this.menu.hide();
			this.isOpen = false;
		}
	})
})(jQuery);