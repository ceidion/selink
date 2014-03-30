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
                placement: 'bottom',
                trigger: 'hover',
                title: '<img src="' + this.model.get('photo') + '" style="width: 140px;">' + this.model.get('firstName') + " " + this.model.get('lastName'),
                content: "123",
                container: 'body'
            })
        }
    });
});