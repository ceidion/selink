define([
	'text!common/template/introduction/user-thumbnail.html'
],function(
	template
) {

	return Backbone.Marionette.ItemView.extend({

		template: template,

		tagName: 'li'

	});
});