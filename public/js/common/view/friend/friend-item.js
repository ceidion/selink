define([
	'text!common/template/friend/friend-item.html'
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
                placement: 'bottom',
                title: "＋友達"
            });

            this.$el.find('.btn-favorite').tooltip({
                placement: 'bottom',
                title: "気になる"
            });

            this.$el.find('.btn-send').tooltip({
                placement: 'bottom',
                title: "送信"
            });
        },

        onAddFriend: function() {

            selink.userActivitiesModel.create({
                type: 'friendRequest',
                title: this.model.get('profile').firstName + ' ' + this.model.get('profile').lastName + 'へ友達にするリクエストを送りました'
            });
        }
	});
});