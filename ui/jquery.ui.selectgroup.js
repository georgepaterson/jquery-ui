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
			
		},
		isOpen: false,
		isActive: false,
		position: 0,
		search: '',
		timer: null,
		_create: function() {
			var self = this, 
				options = this.options,
				id = this.element.attr('id');
			this.identifiers = ['ui-' + id, 'ui-' + id];
			if ($.ui.selectgroup.group.initialised === false) {
				$('body').append($.ui.selectgroup.group);
				$.ui.selectgroup.group.hide();
			}
			$.ui.selectgroup.group.initialised = true;
			if ($(this.element).find('option:selected').length) {
				this.copy = this.element.find('option:selected').text();
			}
			else {
				this.copy = this.element.find('option').first().text();
			}
			this.placeholder = $('<a href="#" id="' + this.identifiers[1] + '" class="' + self.widgetBaseClass + ' ui-widget ui-state-default ui-corner-all"'
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
							self._blur();
							self.close();
						}
						break;
					case $.ui.keyCode.UP:
					case $.ui.keyCode.LEFT:
						event.preventDefault();
						if (!self.isActive) {
							self._focus();
						}
						self._traverse(-1);
						break;
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.RIGHT:
						event.preventDefault();
						if (!self.isActive) {
							self._focus();
						}
						self._traverse(1);
						break;
					case $.ui.keyCode.TAB:
						if (!self.isActive) {
							self._blur();
						}
						if (self.isOpen) {
							self.close();
						}
						break;
					default:
						event.preventDefault();
						if (!self.isActive) {
							self._focus();
						}
						self._autocomplete(String.fromCharCode(event.keyCode));
						break;
					}
				})
				.bind('mouseover.selectgroup', function() {
					$(this).addClass('ui-state-hover');
				})
				.bind('mouseout.selectmenu', function() {
					$(this).removeClass('ui-state-hover');
				});	
			$('label[for="' + id + '"]')
				.attr( 'for', this.identifiers[0] )
				.bind( 'click.selectmenu', function(event) {
					event.preventDefault();
					self.placeholder.focus();
			});
			this._bind(document, {
				click: function(event) {
					if (self.isOpen && !$(event.target).closest('.ui-selectgroup').length ) {
						self._blur();
						self.close();
						$.ui.selectgroup.group.past = null;
					}
				}
			});		
		},
		_index: function() {
			this.selectors = $.map($('option', this.element), function(value) {
				return {
					element: $(value),
					text: $(value).text(),
					optgroup: $(value).parent('optgroup'),
					value: $(value).attr('value'),
					selected: $(value).attr('selected')
				};
			});
			this._build();
		},
		_build: function() {
			var self = this, 
				options = this.options
				hidden = false;
			this.group = $('<ul class="' + self.widgetBaseClass + '-list"></ul>');
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
				if (typeof this.selected !== "undefined" && this.selected === 'selected') {
					list.addClass('ui-state-hover');
					self.position = index;
				}
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
					list.appendTo(self.group);
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
					this._focus();
					this.close();
				}
			}
			$.ui.selectgroup.group.past = this;
			if (!this.isActive) {
				this._focus();
				if (!this.isOpen) {
					this.open();
				}
				return;
			}
			if (!this.isOpen) {
				this.open();
				return;
			}
			if (this.isActive) {
				this._blur();
				if (this.isOpen) {
					this.close();
				}
				return;
			}
			if (this.isOpen) {
				this.close();
				return;
			}
		},
		_traverse: function(value) {
			var local = this.group.find('li').not('.ui-selectgroup-optgroup'),
				maximum = local.length - 1,
				instance = null;	
			this.position += value;
			if (this.position < 0) {
				this.position = 0;
			}
			else if (this.position > maximum) {
				this.position = maximum;
			}
			else {
				instance = local.get(this.position);
				this.copy = $(instance).find('a').text();
				local.removeClass('ui-state-hover');
				$(instance).addClass('ui-state-hover');						
				this.placeholder.find('.ui-selectgroup-copy').text(this.copy);
				this.element.find('option:selected').removeAttr("selected");
				$(this.selectors[this.position].element).attr('selected', 'selected');
			}
			$.ui.selectgroup.group.position = value;
		},
		_autocomplete: function(character) {
			var self = this,
				options = this.options,
				local = this.group.find('li').not('.ui-selectgroup-optgroup'),
				instance = null;
			this.search += character;
			this.search = this.search.toLowerCase();
			$.each(this.selectors, function(index) {
				if (self.search === self.selectors[index].text.substring(0, self.search.length).toLowerCase()) {
					if (options.placeholder) {
						self.position = index - 1;
					}
					else {
						self.position = index;
					}
					instance = local.get(self.position);
					local.removeClass('ui-state-hover');
					$(instance).addClass('ui-state-hover');
					self.placeholder.find('.ui-selectgroup-copy').text(self.selectors[index].text);
					self.element.find('option:selected').removeAttr("selected");
					$(self.selectors[index].element).attr('selected', 'selected');
					return false;	
				}	
			});
			window.clearTimeout(this.timer);
			this.timer = window.setTimeout(function() {self.search = '';}, (1 * 1000));
		},
		destroy: function() {

		},
		enable: function() {

		},
		disable: function() {

		},
		_focus: function() {
			this._index();
			this.search = '';
			window.clearTimeout(this.timer);
			this.isActive = true;
		},
		_blur: function() {
			this.isActive = false;
		},
		open: function() {
			this.placeholder.addClass('ui-state-active');
			$.ui.selectgroup.group.show();
			this.isOpen = true;
		},
		close: function() {
			if ($.ui.selectgroup.group.past !== null) {
				$.ui.selectgroup.group.past.placeholder.removeClass('ui-state-active');
			}
			this.placeholder.removeClass('ui-state-active');
			$.ui.selectgroup.group.hide();
			this.isOpen = false;
		}
	})
	$.ui.selectgroup.group = $('<div class="ui-selectgroup-group ui-widget ui-widget-content ui-corner-bottom"></div>');
	$.ui.selectgroup.group.initialised = false;
	$.ui.selectgroup.group.past = null;
})(jQuery);