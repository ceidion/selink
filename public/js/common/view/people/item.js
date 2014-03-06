define([
	'text!common/template/people/item.html'
],function(
	template
) {

	return Backbone.Marionette.ItemView.extend({

		template: template,

		tagName: 'li',

        className: 'friend-item',

        // initializer
        initialize: function(options) {

            this.events = _.extend({}, this.events, {
                'click .btn-friend': 'onAddFriend'
            });
        },

        onRender: function() {

            // this.$el.find('.btn-friend').tooltip({
            //     placement: 'top',
            //     title: "＋友達"
            // });

            // this.$el.find('.btn-favorite').tooltip({
            //     placement: 'top',
            //     title: "気になる"
            // });

            // this.$el.find('.btn-send').tooltip({
            //     placement: 'top',
            //     title: "送信"
            // });
        },

        onAddFriend: function() {

            var self = this;

            this.$el.find('.btn-friend').button('loading');

            selink.waitApproveModel.create({
                friendId: this.model.get('_id')
            }, {
                success: function() {
                    // self.$el.find('.btn-friend').button('reset');
                    self.$el.find('.btn-friend')
                            .removeClass('btn-info btn-friend')
                            .addClass('btn-success')
                            .empty()
                            .html('<i class="icon-ok light-green"></i>&nbsp;友達リクエスト送信済み');
                    selink.userModel.get('invited').push(self.model.get('_id'));
                }
            });
        }
	});
});