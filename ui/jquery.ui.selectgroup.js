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
			if ($(this.element).find('option:selected').length) {
				this.copy = this.element.find('option:selected').text()
			}
			else {
				this.copy = this.element.find('option').first().text()
			}
			this.placeholder = $('<a href="#" class="' + self.widgetBaseClass + ' ui-widget ui-state-default ui-corner-all"'
				+ 'role="button" aria-haspopup="true" aria-owns="">'
				+ '<span class="' + self.widgetBaseClass + '-copy">'+ this.copy +'</span>'
				+ '<span class="' + self.widgetBaseClass + '-icon ui-icon ui-icon-triangle-1-s"></span></a>');
			this.element.after(this.placeholder)
				.hide();
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
			this._bind(document, {
				click: function(event) {
					if (self.isOpen && !$(event.target).closest('.ui-selectgroup').length ) {
						self.close();
						$.ui.selectgroup.group.past = null;
					}
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
			this.group = $('<ul class="' + self.widgetBaseClass + '-list"></ul>');
			$.each(this.selectors, function() {
				var list = $('<li><a href="#">'+ this.text +'</a></li>');
				if (this.optgroup.length) {
					var name = self.widgetBaseClass + '-optgroup-' + self.element.find('optgroup').index(this.optgroup);
					if (self.group.find('li.' + name).length ) {
						self.group.find('li.' + name + ' ul').append(list);
						list.bind('click.selectgroup', function(event) {
							event.preventDefault();
							
							
						});
					}
					else {
						var opt = '<li class="' + name + ' ' + self.widgetBaseClass + '-optgroup"><span>'+ this.optgroup.attr('label') +'</span><ul></ul></li>';
						$(opt).appendTo(self.group).find('ul').append(list);
						list.bind('click.selectgroup', function(event) {
							event.preventDefault();
							
							
						});
					}
				}
				else {
					list.appendTo(self.group).bind('click.selectgroup', function(event) {
						event.preventDefault();
						
						
					});
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
			if ($.ui.selectgroup.group.past !== null) {
				$.ui.selectgroup.group.past.placeholder.removeClass('ui-state-active');
			}
			this.placeholder.removeClass('ui-state-active');
			this.isOpen = false;
		}
	})
	$.ui.selectgroup.group = $('<div class="ui-selectgroup-group ui-widget ui-widget-content ui-corner-bottom"></div>');
	$.ui.selectgroup.group.initialised = false;
	$.ui.selectgroup.group.past = null;
})(jQuery);