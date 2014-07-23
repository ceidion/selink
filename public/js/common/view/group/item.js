define([
    'text!common/template/group/item.html',
    'text!common/template/people/popover.html',
    'common/view/group/detail/event',
],function(
    template,
    popoverTemplate,
    EventView
) {

    return Backbone.Marionette.CompositeView.extend({

        template: template,

        className: 'isotope-item col-xs-12 col-md-6 col-lg-4',

        childView: EventView,

        childViewContainer: '.events-container',

        events: {
            'click .btn-join': 'onJoin',
        },

        initialize: function() {

            // this.collection = new Backbone.Collection(this.model.get('events'));
            // console.log(this.model);
        },

        // after render
        onRender: function() {

            this.$el.find('.fa-group').tooltip({
                placement: 'top',
                title: this.model.get('participants').length + "人参加中"
            });

            // add tooltip on add button
            this.$el.find('.fa-tasks').tooltip({
                placement: 'top',
                title: "イベント" + this.model.get('events').length + "件"
            });

            this.$el.find('.fa-edit').tooltip({
                placement: 'top',
                title: "投稿" + this.model.get('posts').length + "件"
            });
        },

        // join group
        onJoin: function() {

            var self = this;

            // show loading icon, and prevent user click twice
            this.$el.find('.btn-join').button('loading');

            // create a participant in this group
            this.model.save({
                participants: selink.userModel.id //TODO: no need to pass this parameter
            }, {
                url: this.model.url() + '/join',
                success: function(model, response, options) {

                    var joinedLabel = $('<span class="text-success"><i class="ace-icon fa fa-check"></i>&nbsp;参加中</span>');

                    // change the add button to label
                    self.$el.find('.btn-join').fadeOut(function() {
                        self.$el.find('.group-info').prepend(joinedLabel);
                        self.trigger('ensureLayout');
                    });

                    // sycn with user model
                    selink.userModel.groups.add(model);
                },
                patch: true,
                wait: true
            });
        },

    });
});