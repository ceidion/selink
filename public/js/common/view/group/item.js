define([
    'text!common/template/group/item.html',
    'text!common/template/people/popover.html',
],function(
    template,
    popoverTemplate
) {

    return Backbone.Marionette.ItemView.extend({

        template: template,

        className: 'isotope-item col-xs-12 col-sm-6 col-lg-4',

        events: {
            'click .avatar': 'toProfile',
        },

        // after render
        onRender: function() {

            // add popover on author photo
            this.$el.find('.avatar').popover({
                html: true,
                trigger: 'hover',
                container: 'body',
                placement: 'auto top',
                title: '<img src="' + this.model.get('_owner').cover + '" />',
                content: _.template(popoverTemplate, this.model.get('_owner')),
            });

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

        // turn to user profile page
        toProfile: function(e) {

            // stop defautl link behavior
            e.preventDefault();

            // destroy the popover on user's photo
            this.$el.find('.avatar').popover('destroy');
            // turn the page manually
            window.location = '#profile/' + this.model.get('_owner')._id;
        }

    });
});