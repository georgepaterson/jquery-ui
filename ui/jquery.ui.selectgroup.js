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
		position: 0,
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
				self._toggle();
			})
			.bind("keydown.selectmenu", function(event) {
				switch (event.keyCode) {
					case $.ui.keyCode.ENTER:
						event.preventDefault();
						self._toggle();
						break;
					case $.ui.keyCode.ESCAPE:
						event.preventDefault();
						if (self.isOpen) {
							self.close();
						}
						break;
					case $.ui.keyCode.UP:
						event.preventDefault();
						self._traverse(-1);
						break;
					case $.ui.keyCode.DOWN:
						event.preventDefault();
						if (!self.isOpen) {
							self.open();
						}
						self._traverse(1);
						break;
					case $.ui.keyCode.LEFT:
						event.preventDefault();
						self._traverse(-1);
						break;
					case $.ui.keyCode.RIGHT:
						event.preventDefault();
						self._traverse(1);
						break;
					case $.ui.keyCode.TAB:
						if (self.isOpen) {
							self.close();
						}
						break;
					default:
						break;
				}
			})
			.bind('mouseover.selectgroup', function() {
				$(this).addClass('ui-state-hover');
			})
			.bind('mouseout.selectmenu', function() {
				$(this).removeClass('ui-state-hover');
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
					element: $(value),
					text: $(value).text(),
					optgroup: $(value).parent('optgroup'),
					value: $(value).attr('value')
				};
			});
			this._build();
		},
		_build: function() {
			var self = this, 
				options = this.options
				hidden = false;
			this.group = $('<ul class="' + self.widgetBaseClass + '-list"></ul>');
			if (options.placeholder) {
				this.position -= 1;
			}
			$.each(this.selectors, function(index) {
				var list = $('<li><a href="#">'+ this.text +'</a></li>')
					.bind('click.selectgroup', function(event) {
						event.preventDefault();
						self.copy = self.selectors[index].text;
						self.placeholder.find('.ui-selectgroup-copy').text(self.copy);
						self.element.find('option:selected').removeAttr("selected");
						$(self.selectors[index].element).attr('selected', 'selected');
						self.position = index;
					})
					.bind('mouseover.selectgroup', function() {
						$(this).addClass('ui-state-hover');
					})
					.bind('mouseout.selectmenu', function() {
						$(this).removeClass('ui-state-hover');
					});
				if (this.optgroup.length) {
					var name = self.widgetBaseClass + '-optgroup-' + self.element.find('optgroup').index(this.optgroup);
					if (self.group.find('li.' + name).length ) {
						self.group.find('li.' + name + ' ul').append(list);
					}
					else {
						var opt = '<li class="' + name + ' ' + self.widgetBaseClass + '-optgroup"><span>'+ this.optgroup.attr('label') +'</span><ul></ul></li>';
						$(opt).appendTo(self.group).find('ul').append(list);
					}
				}
				else {
					if (options.placeholder && index === 0) {
						hidden = true;
					}
					if (!hidden) {
						list.appendTo(self.group);
					}
					hidden = false;
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
		_toggle: function() {
			if ($.ui.selectgroup.group.past !== null) {
				if ($.ui.selectgroup.group.past.element !== this.element) {
					this.close();
				}
			}
			if (!this.isOpen) {
				this.open();
			} 
			else {
				this.close();
			}
			$.ui.selectgroup.group.past = this;
		},
		_traverse: function(value) {
			var local = this.group.find('li').not('.ui-selectgroup-optgroup'),
				maximum = local.length
				instance = null;
			this.position += value;
			if (this.position < 0) {
				this.position = 0;
			}
			else if (this.position >= maximum) {
				this.position = maximum;
			}
			else {
				instance = local.get(this.position)
				this.copy = $(instance).find('a').text();
				$(instance).addClass('ui-state-hover');							
				this.placeholder.find('.ui-selectgroup-copy').text(this.copy);
				this.element.find('option:selected').removeAttr("selected");
				$(this.selectors[this.position].element).attr('selected', 'selected');
			}
			$.ui.selectgroup.group.position = value;
		},
		_focus: function() {
			
		},
		_select: function() {
			
		},
		change: function() {
			
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
		},
		refresh: function() {
			
		}
	})
	$.ui.selectgroup.group = $('<div class="ui-selectgroup-group ui-widget ui-widget-content ui-corner-bottom"></div>');
	$.ui.selectgroup.group.initialised = false;
	$.ui.selectgroup.group.past = null;
})(jQuery);