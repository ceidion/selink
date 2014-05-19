define([
    'text!common/template/people/detail/friend.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        // template
        template: template,

        tagName: 'li',

        // class name
        className: 'timeline-item',

        events: {
            'click a': 'onClick'
        },

        onShow: function() {
            this.$el.find('img').popover({
                html: true,
                trigger: 'hover',
                container: 'body',
                placement: 'auto',
                title: '<img src="' + this.model.get('cover') + '" />',
                content: '<div class="profile-picture"><img src="' + this.model.get('photo') + '" /></div><div class="inline"><strong>' + this.model.get('firstName') + ' ' + this.model.get('lastName') + '</strong></div>',
            });
        },

        onClick: function(e) {

            e.preventDefault();

            this.$el.find('img').popover('destroy');
            window.location = '#profile/' + this.model.get('_id');
        }

    });
});