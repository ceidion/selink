define([
    'text!common/template/group/edit/member/friends.html',
    'common/view/group/edit/member/item'
], function(
    template,
    ItemView
) {

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // item view container
        itemViewContainer: '.ace-thumbnails',

        // item view
        itemView: ItemView,

        events: {
            'click .btn-add-all': 'onAddAll',
            'click .btn-invite': 'onInvite'
        },

        // item events
        itemEvents: {
            'clicked': 'onItemClick'
        },

        // initailizer
        initialize: function() {

            // selected friend will saved here temprary
            this.selectFriends = [];
            // selected friend view's $el will save here
            this.selectView = [];
        },

        // after the view collection rendered
        onCompositeCollectionRendered: function() {

            var self = this;

            // here we need a time-out call, cause this view is in a modal
            // and the modal will take a piece of time to be visible.
            // isotope only process the visible elements, if we isotope on it immediatly
            // isotope will not work. so I wait 0.3s here
            setTimeout(function() {
                // enable isotope
                self.$el.find(self.itemViewContainer).isotope({
                    itemSelector : '.isotope-item'
                });
            }, 300);
        },

        // after show
        onShow: function() {

            // make container scrollable
            this.$el.find('.widget-main').niceScroll({
                horizrailenabled: false
            });
        },

        // add all friend
        onAddAll: function(e) {

            e.preventDefault();

            this.children.each(function(view) {
                view.onClick();
            });
        },

        onItemClick: function(event, view) {

            if (_.indexOf(this.selectFriends, view.model.id) < 0) {
                this.selectFriends.push(view.model.id);
                this.selectView.push(view.$el);
            } else {
                this.selectFriends = _.without(this.selectFriends, view.model.id);
                this.selectView = _.without(this.selectView, view.$el);
            }

            if (this.selectFriends.length)
                this.$el.find('.btn-invite').removeClass('disabled');
            else
                this.$el.find('.btn-invite').addClass('disabled');
        },

        onInvite: function() {

            var self = this;

            this.model.save({
                invited: this.selectFriends
            }, {
                url: this.model.url() + '/invite',
                success: function() {

                    self.$el.find('.btn-invite').addClass('disabled');

                    _.each(self.selectView, function(view) {
                        self.$el.find(self.itemViewContainer).isotope('remove', view).isotope('layout');
                    });

                    self.selectFriends = [];
                    self.selectView = [];
                },
                patch: true,
                wait: true
            });
        }

    });
});