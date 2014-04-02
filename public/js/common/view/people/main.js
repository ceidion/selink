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

    var Introductions = BaseCollection.extend({

        url: '/people'
    });

    return BaseView.extend({

        // template
        template: template,

        // item view
        itemView: ItemView,

        // initializer
        initialize: function() {

            // create people collection
            this.collection = new Introductions();

            // call super initializer
            BaseView.prototype.initialize.apply(this);
        }

    });

});