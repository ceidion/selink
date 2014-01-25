define([
    'common/view/composite-base',
    'text!common/template/introduction/introductions.html',
    'common/view/introduction/user-thumbnail',
    'common/collection/introductions'
], function(
    BaseView,
    template,
    ItemView,
    IntroductionsModel) {

    return BaseView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // item view container
        itemViewContainer: '.ace-thumbnails',

        // item view
        itemView: ItemView,

        // max item number
        itemLimit: 6,

        // initializer
        initialize: function() {

            var self = this

            this.events = _.extend({}, this.events);

            this.collection = new IntroductionsModel();
            this.collection.fetch({
                success: function() {
                }
            });
        },

        onRender: function() {

        }

    });

});