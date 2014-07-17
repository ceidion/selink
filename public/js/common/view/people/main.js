define([
    'text!common/template/people/main.html',
    'common/view/composite-isotope',
    'common/collection/base',
    'common/view/people/item',
], function(
    template,
    BaseView,
    BaseCollection,
    ItemView
) {

    var PeopleCollection = BaseCollection.extend({

        url: '/connections?type=discover&fields=type,firstName,lastName,title,cover,bio,photo,employments,educations,createDate&per_page=20&page=0'
    });

    return BaseView.extend({

        // template
        template: template,

        // child view
        childView: ItemView,

        // initializer
        initialize: function() {

            // create people collection
            this.collection = new PeopleCollection();
        }

    });

});