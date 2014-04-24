define([
    'text!common/template/friend/item.html'
],function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        template: template,

        // tagName: 'li',

        className: 'photo-item',

        onRender: function() {
            // this.$el.find('img').popover({
            //     placement: 'auto',
            //     html: true,
            //     trigger: 'hover',
            //     container: 'body',
            //     title: this.model.get('firstName') + " " + this.model.get('lastName'),
            //     content: "123"
            // });

            // this.$el.find('img').tooltip({
            //     title: this.model.get('firstName') + " " + this.model.get('lastName'),
            //     placement: 'left'
            // });
        }
    });
});