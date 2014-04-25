define([
    'text!common/template/mailbox/main.html',
    'common/collection/base',
    'common/view/mailbox/inbox',
    'common/view/mailbox/sentbox'
], function(
    template,
    BaseCollection,
    InBoxView,
    SentBoxView
) {

    return Backbone.Marionette.Layout.extend({

        className: 'tabbable',

        // template
        template: template,

        // regions
        regions: {
            inBoxRegion: '#inbox',
            sentBoxRegion: '#sentbox',
            draftBoxRegion: '#draftbox'
        },

        // initializer
        initialize: function() {
            // create component
            this.inBox = new InBoxView();
            this.sentBox = new SentBoxView();
            // this.draftBox = new DraftBoxView({model: this.model});
        },

        // after render
        onRender: function() {
            // show every component
            this.inBoxRegion.show(this.inBox);
            this.sentBoxRegion.show(this.sentBox);
            // this.draftBoxRegion.show(this.draftBox);
        },

        // after show
        onShow: function() {
            this.$el.addClass('animated fadeInUp');
        }

    });
});