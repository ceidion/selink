define([
    'text!common/template/activity/main.html',
    'common/collection/base',
    'common/view/activity/item-day'
], function(
    template,
    BaseCollection,
    ItemView) {

    var Activities = BaseCollection.extend({

        url: '/activities'
    });

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // item view container
        itemViewContainer: this.$el,

        // item view
        itemView: ItemView,

        // initializer
        initialize: function() {

            var self = this;

            this.collection = new Backbone.Collection();

            var rawData = new Activities();
            rawData.document = this.model;

            rawData.fetch({
                success: function(collection, response, options) {
                    var groupData = _.groupBy(response, function(activity) {
                        return moment(activity.createDate).format('YYYY/MM/DD');
                    });

                    var models = [];

                    for(var date in groupData) {
                        models.push({
                            date: date,
                            activities: groupData[date]
                        });
                    }

                    self.collection.add(models);
                }
            });
        },

        onRender: function() {

        }
    });

});