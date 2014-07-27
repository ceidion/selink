define([
    'text!common/template/group/detail/member/item-ro.html',
    'text!common/template/people/popover.html'
],function(
    template,
    popoverTemplate
) {

    return Backbone.Marionette.ItemView.extend({

        template: template,

        tagName: 'li',

        className: 'isotope-item-2 col-xs-2 no-padding',

        onShow: function() {

            this.$el.find('a').popover({
                html: true,
                trigger: 'hover',
                container: 'body',
                placement: 'auto top',
                title: '<img src="' + this.model.get('cover') + '" />',
                content: _.template(popoverTemplate, this.model.attributes),
            });
        }

    });
});