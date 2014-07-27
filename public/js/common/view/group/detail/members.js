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

        url: '/groups/discover'
    });

    return BaseView.extend({

        // class name
        className: "widget-box transparent",

        // template
        template: template,

        // child view container
        childViewContainer: '.ace-thumbnails',

        // child view
        childView: ItemView,

        // initializer
        initialize: function() {

            this.collection = new MembersCollection();
        }

    });
});