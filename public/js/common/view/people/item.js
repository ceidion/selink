define([
	'text!common/template/people/item.html'
],function(
	template
) {

	return Backbone.Marionette.ItemView.extend({

		template: template,

		tagName: 'li',

        className: 'friend-item col-xs-12 col-sm-6 col-lg-4',

        // initializer
        initialize: function(options) {

            this.events = _.extend({}, this.events, {
                'click .btn-friend': 'onAddFriend'
            });
        },

        onAddFriend: function() {

            var self = this;

            this.$el.find('.btn-friend').button('loading');

            this.model.save({
                _id: this.model.get('_id'),
                firstName: this.model.get('firstName'),
                lastName: this.model.get('lastName')
            }, {
                url: './users/' + selink.userModel.id + '/friends',
                success: function() {
                    // self.$el.find('.btn-friend').button('reset');
                    self.$el.find('.btn-friend')
                            .removeClass('btn-info btn-friend')
                            .addClass('btn-success')
                            .empty()
                            .html('<i class="icon-ok light-green"></i>&nbsp;友達リクエスト送信済み');
                    selink.userModel.get('invited').push(self.model.get('_id'));
                },
                patch: true
            });
        },

	});
});