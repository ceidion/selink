define([
    'text!common/template/group/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/view/group/item',
    'common/model/group'
], function(
    pageTemplate,
    BaseView,
    BaseCollection,
    ItemView,
    GroupModel
) {

    var GroupsCollection = BaseCollection.extend({

        url: '/groups?fields=_owner,type,name,cover,description,participants,posts,events,createDate&embed=_owner'
    });

    return BaseView.extend({

        // Template
        template: pageTemplate,

        // child view
        childView: ItemView,

        // Initializer
        initialize: function() {

            // create posts collection
            this.collection = new GroupsCollection();
        }

    });
});