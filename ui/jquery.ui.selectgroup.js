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
		_create: function() {
			var self = this, 
				options = this.options;
			this.menu = $('<div class="ui-selectgroup-menu"></div>');
			$('body').append(this.menu);
			this.placeholder = $('<a href="#" class="ui-selectgroup ui-widget ui-state-default ui-corner-all"'
				+ 'role="button" aria-haspopup="true" aria-owns="">'
				+ '<span class="">Placeholder text</span>'
				+ '<span class=""></span></a>');
			$(this.element).after(this.placeholder);
			$(this.element).hide();
			this.placeholder.bind('click', function(event) {
				event.stopPropagation();
				event.preventDefault();
				
			})
		},
		_init: function() {
			var self = this, 
				options = this.options;

		},
		destroy: function() {

		},
		enable: function() {

		},
		disable: function() {

		}
	})
})(jQuery);