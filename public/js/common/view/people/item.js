define([
    'text!common/template/people/item.html'
],function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        template: template,

        className: 'isotope-item col-xs-12 col-sm-6 col-lg-4',

        events: {
            'click .btn-friend': 'onAddFriend'
        },

        onAddFriend: function() {

            var self = this;

            // disable the button, user can't push twice
            this.$el.find('.btn-friend').button('loading');

            // create a friend in invited list
            selink.userModel.invited.create({
                _id: this.model.get('_id')
            }, {
                success: function() {
                    // change the label of the add button, but still disabled
                    self.$el.find('.btn-friend')
                        .removeClass('btn-info btn-friend')
                        .addClass('btn-success')
                        .empty()
                        .html('<i class="icon-ok light-green"></i>&nbsp;友達リクエスト送信済み');
                },
                patch: true,
                wait: true
            });
        }

    });
});