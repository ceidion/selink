define([
    'text!common/template/group/detail/members.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/view/group/detail/member'
], function(
    template,
    BaseView,
    BaseCollection,
    ItemView
) {

    var MembersCollection = BaseCollection.extend({

        url: function() {
            return '/groups/' + this.document.id + '/connections/participants';
        }
    });

    return BaseView.extend({

        // class name
        className: "widget-box transparent",

        // template
        template: template,

        // child view container
        childViewContainer: '.widget-main',

        // child view
        childView: ItemView,

        // child selector
        childSelector: '.thumbnail-item',

        // initializer
        initialize: function() {

            this.collection = new MembersCollection(null, {document: this.model});
        },

        // after render
        onRender: function() {

            // add tooltip on add button
            this.$el.find('.btn-member').tooltip({
                placement: 'top',
                title: "メンバー管理",
                container: 'body',
                template: '<div class="tooltip tooltip-success"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
            });
        }

    });
});