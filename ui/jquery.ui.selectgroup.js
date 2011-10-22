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
			autoWidth: true
		},
		isOpen: false,
		isActive: false,
		isDisabled: false,
		position: 0,
		search: ['', '', 1, 1, 0],
		timer: null,
		_create: function() {
			var that = this,
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
			this.placeholder = $('<a href="#" id="' + this.identifiers[1] + '" class="' + this.widgetBaseClass + ' ui-widget ui-state-default ui-corner-all"'
				+ 'role="button" aria-haspopup="true" aria-owns="' + this.widgetBaseClass + '-group">'
				+ '<span class="' + this.widgetBaseClass + '-copy">'+ this.copy +'</span>'
				+ '<span class="' + this.widgetBaseClass + '-icon ui-icon ui-icon-triangle-1-s"></span></a>');
			this.element.after(this.placeholder).hide();
			this._placeholderEvents(true);
			$('label[for="' + id + '"]').attr( 'for', this.identifiers[0] );
			this._bind($('label[for="' + this.identifiers[0] + '"]'), {
				'click': function(event) {
					event.preventDefault();
					this.placeholder.focus();
				}
			});
			this._bind(document, {
				'click': function(event) {
					if (this.isOpen && !($(event.target).closest('.ui-selectgroup').length || $(event.target).closest('.ui-selectgroup-group').length)) {
						window.setTimeout( function() {
							that.blur();
							that.close();
							$.ui.selectgroup.group.past = null;
						}, (100));
					}
				}
			});	
		},
		_placeholderEvents: function(value) {
			if (value = true) {
				this._bind(this.placeholder, {
					'click': function(event) {
						event.preventDefault();
						this._toggle();
					},
					'keydown': function(event) {
						switch (event.keyCode) {
							case $.ui.keyCode.ENTER:
								event.preventDefault();
								this.submit();
								break;
							case $.ui.keyCode.ESCAPE:
								event.preventDefault();
								if (this.isOpen) {
									this.blur();
									this.close();
								}
								break;
							case $.ui.keyCode.UP:
							case $.ui.keyCode.LEFT:
								event.preventDefault();
								if (!this.isActive) {
									this.focus();
								}
								this._traverse(-1);
								break;
							case $.ui.keyCode.DOWN:
							case $.ui.keyCode.RIGHT:
								event.preventDefault();
								if (!this.isActive) {
									this.focus();
								}
								this._traverse(1);
								break;
							case $.ui.keyCode.TAB:
								if (!this.isActive) {
									this.blur();
								}
								if (this.isOpen) {
									this.close();
								}
								break;
							default:
								event.preventDefault();
								if (!this.isActive) {
									this.focus();
								}
								this._typeahead(String.fromCharCode(event.keyCode).toLowerCase());
								break;
						}
					},
					'mouseover': function(event) {
						$(this).addClass('ui-state-hover');
					},
					'mouseout': function(event) {
						$(this).removeClass('ui-state-hover');
					}
				});
			}
			else {
				this.placeholder.addClass('ui-state-disabled').unbind('.selectgroup');
				this._bind(this.placeholder, {
					'click': function(event) {
						event.preventDefault();
					},
					'keydown': function(event) {
						event.preventDefault();
					}
				});
			}
		},
		_index: function() {
			this.selectors = $.map($('option', this.element), function(value) {
				return {
					element: $(value),
					text: $(value).text(),
					optgroup: $(value).parent('optgroup'),
					optDisabled: $(value).parent('optgroup').attr('disabled'),
					value: $(value).attr('value'),
					selected: $(value).attr('selected'),
					disabled: $(value).attr('disabled'),
				};
			});
			this._build();
		},
		_build: function() {
			var that = this, 
				hidden = false;
			this.group = $('<ul class="' + this.widgetBaseClass + '-list" role="listbox" aria-hidden="true"></ul>');
			if (this.options.autoWidth) {
				this.group.width(this.placeholder.width());
			}
			$.each(this.selectors, function(index) {
				var list = $('<li role="presentation"><a role="option" href="#">'+ this.text +'</a></li>')
				that._bind(list, {
					'click': function(event) {
						event.preventDefault();
						that.copy = that.selectors[index].text;
						that.placeholder.find('.ui-selectgroup-copy').text(that.copy);
						that.element.find('option:selected').removeAttr("selected");
						$(that.selectors[index].element).attr('selected', 'selected');
						that.position = index;
						that._toggle();
					},
					'mouseover': function(event) {
						if (that.disabled !== 'disabled' && that.optDisabled !== 'disabled') {
							$(list).addClass('ui-state-hover');
						}
					},
					'mouseout': function(event) {
						$(list).removeClass('ui-state-hover');
					}
				});
				if (typeof this.selected !== "undefined" && this.selected === 'selected') {
					list.addClass('ui-state-hover');
					that.position = index;
				}
				if (typeof this.disabled !== "undefined" && this.disabled === 'disabled') {
					list.addClass('ui-state-disabled');
				}
				if (this.optgroup.length) {
					var name = that.widgetBaseClass + '-optgroup-' + that.element.find('optgroup').index(this.optgroup);
					if (that.group.find('li.' + name).length ) {
						that.group.find('li.' + name + ' ul').append(list);
					}
					else {
						var opt = '<li class="' + name + ' ' + that.widgetBaseClass + '-optgroup"><span>'+ this.optgroup.attr('label') +'</span><ul></ul></li>';
						if (typeof this.optDisabled !== "undefined" && this.optDisabled === 'disabled') {
							$(opt).addClass('ui-state-disabled').appendTo(that.group).find('ul').append(list);
						}
						else {
							$(opt).appendTo(that.group).find('ul').append(list);
						}
					}
				}
				else {
					list.appendTo(that.group);
				}	
			});
			this.group.attr('aria-labelledby', this.identifiers[0]);
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
					this.focus();
					this.close();
				}
			}
			$.ui.selectgroup.group.past = this;
			if (!this.isActive) {
				this.focus();
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
				this.blur();
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
		_traverse: function(value, record) {
			var local = this.group.find('li').not('.ui-selectgroup-optgroup'),
				maximum = local.length - 1,
				position = this.position,
				instance = null;	
			  position = this.position + value;
				if (position < 0) {
					position = 0;
				}
				if (position > maximum) {
					position = maximum;
				}
				if (position === record) { 
					return;
				}
				if (this.selectors[position].disabled === 'disabled' || this.selectors[position].optDisabled === 'disabled') {
					if (value > 0) {
						++value;
					}
					else {
						--value;
					}
					this._traverse(value, position);
				}
				else {
					this.position = position;
					instance = local.get(this.position);
					this.copy = $(instance).find('a').text();
					local.removeClass('ui-state-hover');
					$(instance).addClass('ui-state-hover');						
					this.placeholder.find('.ui-selectgroup-copy').text(this.copy);
					this.element.find('option:selected').removeAttr('selected');
					$(this.selectors[this.position].element).attr('selected', 'selected');
				}
			$.ui.selectgroup.group.position = value;
		},
		_typeahead: function(character) {
			var that = this,
				options = this.options,
				local = this.group.find('li').not('.ui-selectgroup-optgroup'),
				instance = null,
				found = false;
			character = character.toLowerCase();
			this.search[1] += character;
			window.clearTimeout(this.timer);
			function focusOption(index) {
				that.position = index;
				instance = local.get(that.position);
				local.removeClass('ui-state-hover');
				$(instance).addClass('ui-state-hover');
				that.placeholder.find('.ui-selectgroup-copy').text(that.selectors[index].text);
				that.element.find('option:selected').removeAttr('selected');
				$(that.selectors[index].element).attr('selected', 'selected');
				found = true;
				that.search[3] = index;
			};
			if (this.search[0] === this.search[1][0]) {
				if (this.search[1].length < 2) {
					$.each(this.selectors, function(index) {
						if (!found) {
							if (that.selectors[index].text.toLowerCase().indexOf(that.search[1][0]) === 0) {
								if (that.search[0] == that.search[1][0]) {
									if (that.search[3] < index) {
										focusOption(index);
									}
								}
							}
						}
					});				
					this.search[0] = this.search[1][0];
				}
				else {
					$.each(this.selectors, function(index) {
						if (!found) {
							if (that.selectors[index].text.toLowerCase().indexOf(that.search[1]) === 0) {
								if (that.search[0][0] == that.search[1][0]) {
									if (that.search[3] < index) {
										focusOption(index);
									}
								}
							}
						}
					});
					this.search[0] = this.search[1][0];
				}
			}
			else {
				$.each(this.selectors, function(index) {
					if (!found) {
						if (that.search[1] === that.selectors[index].text.substring(0, that.search[1].length).toLowerCase()) {
							that.search[2] = index;
							focusOption(index);
						}
					}
				});
				this.search[0] = this.search[1][0];
			}
			if (that.search[4] === that.search[3]) {
				that.search[3] = that.search[2];
				focusOption(that.search[3]);
			}
			this.search[4] = this.search[3];
			this.timer = window.setTimeout(function() {that.search[1] = '';}, (1000));
		},
		destroy: function() {
			var id = this.identifiers[0].split('ui-')
			if (this.isOpen) {
				this.close();
			}
			this.placeholder.remove();
			$(document).unbind('.selectgroup');
			$('label[for="' + this.identifiers[0] + '"]')
				.attr( 'for', id[1] )
				.unbind( '.selectmenu');
			this.element.show();
		},
		enable: function(index, type) {
			if (this.isOpen) {
				this.close();
			}
			if (typeof (index) == 'undefined') {
				this.placeholder.removeClass('ui-state-disabled');
				this._placeholderEvents(true);
			}
			else {
				if ( type == 'optgroup' ) {
					this.element.find('optgroup').eq(index).removeAttr('disabled');
				} 
				else {
					this.element.find('option').eq(index).removeAttr('disabled');
				}
			}
		},
		disable: function(index, type) {
			if (this.isOpen) {
				this.close();
			}
			if (typeof (index) == 'undefined') {
				this.placeholder.addClass('ui-state-disabled');
				this._placeholderEvents(false);
			}
			else {
				if ( type == 'optgroup' ) {
					this.element.find('optgroup').eq(index).attr('disabled', 'disabled');
				} 
				else {
					this.element.find('option').eq(index).attr('disabled', 'disabled');
				}
			}
		},
		submit: function() {
			this.element.closest('form').trigger('submit');
		},
		focus: function() {
			this._index();
			this.isActive = true;
		},
		blur: function() {
			this.isActive = false;
		},
		change: function() {
			this._index();
		},
		refresh: function() {
			if ($(this.element).find('option:selected').length) {
				this.copy = this.element.find('option:selected').text();
			}
			else {
				this.copy = this.element.find('option').first().text();
			}
			this.placeholder.find('.ui-selectgroup-copy').text(this.copy);
		},
		open: function() {
			this.placeholder.addClass('ui-state-active');
			$.ui.selectgroup.group.show();
			this.group.attr('aria-hidden', 'false');
			this.isOpen = true;
		},
		close: function() {
			if ($.ui.selectgroup.group.past !== null) {
				$.ui.selectgroup.group.past.placeholder.removeClass('ui-state-active');
			}
			this.placeholder.removeClass('ui-state-active');
			$.ui.selectgroup.group.hide();
			this.group.attr('aria-hidden', 'true');
			this.isOpen = false;
		}
	})
	$.ui.selectgroup.group = $('<div class="ui-selectgroup-group ui-widget ui-widget-content ui-corner-bottom"></div>');
	$.ui.selectgroup.group.initialised = false;
	$.ui.selectgroup.group.past = null;
})(jQuery);