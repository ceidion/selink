define([
    'text!common/template/group/detail/event.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        // template
        template: template,

        className: 'external-event label label-xlg arrowed arrowed-right',

        onRender: function() {

            if (this.model.get('className'))
                this.$el.addClass(this.model.get('className'));
            else
                this.$el.addClass('label-primary');
        }

    });
});