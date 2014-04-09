define([
    'text!common/template/friend/item.html'
],function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        template: template,

        tagName: 'li',

        onRender: function() {
            this.$el.find('img').popover({
                html: true,
                placement: 'auto',
                trigger: 'hover',
                title: this.model.get('firstName') + " " + this.model.get('lastName'),
                content: "123",
                container: 'body'
            });
        }
    });
});