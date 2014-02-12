define([
	'text!common/template/introduction/user-thumbnail.html'
],function(
	template
) {

	return Backbone.Marionette.ItemView.extend({

		template: template,

		tagName: 'li',

        // initializer
        initialize: function(options) {

            this.events = _.extend({}, this.events, {
                'click .btn-friend': 'onAddFriend'
            });
        },

        onRender: function() {

            this.$el.find('.btn-friend').tooltip({
                placement: 'top',
                title: "＋友達"
            });

            this.$el.find('.btn-favorite').tooltip({
                placement: 'top',
                title: "気になる"
            });

            this.$el.find('.btn-send').tooltip({
                placement: 'top',
                title: "送信"
            });
        },

        onAddFriend: function() {

            selink.friendsModel.create({
                userid: this.model.get('_id')
            });
        }
	});
});