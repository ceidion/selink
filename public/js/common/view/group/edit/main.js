define([
    'text!common/template/group/edit/main.html',
    'common/view/group/edit/cover',
    'common/view/group/edit/name',
    'common/view/group/edit/description',
    'common/view/group/edit/member',
], function(
    template,
    CoverItem,
    NameItem,
    DescriptionItem,
    MemberItem
) {

    // profile view
    return Backbone.Marionette.Layout.extend({

        // template
        template: template,

        // regions
        regions: {
            coverRegion: '#cover',
            nameRegion: '#name',
            descriptionRegion: '#description',
        },

        // events
        events: {
            'click .btn-member': 'showMemberEditor'
        },

        // initializer
        initialize: function() {
            // create component
            this.coverItem = new CoverItem({model: this.model});
            this.nameItem = new NameItem({model: this.model});
            this.descriptionItem = new DescriptionItem({model: this.model});
        },

        // after render
        onRender: function() {
            // show every component
            this.coverRegion.show(this.coverItem);
            this.nameRegion.show(this.nameItem);
            this.descriptionRegion.show(this.descriptionItem);

            Backbone.Validation.bind(this);
        },

        // after show
        onShow: function() {
            this.$el.addClass('animated fadeInRight');
        },

        showMemberEditor: function() {

            // create member edit dialog with this view's model
            var memberEditView = new MemberItem({
                model: this.model
            });

            // show edit dialog
            selink.modalArea.show(memberEditView);
            selink.modalArea.$el.modal('show');
        }
    });
});