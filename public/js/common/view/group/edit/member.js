define([
    'text!common/template/group/edit/member.html'
], function(
    template
) {

    return Backbone.Marionette.Layout.extend({

        // template
        template: template,

        // this view is a modal dialog
        className: 'modal-dialog job-modal',

        // regions
        regions: {
            languageRegion: '#languages',
            skillRegion: '#skills',
        },

        // initializer
        initialize: function() {

        },

        // after render
        onRender: function() {

            // // show language area
            // this.languageRegion.show(this.languageComposite);
            // // show skill area
            // this.skillRegion.show(this.skillComposite);

        }

    });
});