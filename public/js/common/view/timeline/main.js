define([
    'text!common/template/timeline/main.html',
    'common/view/timeline/item-day'
], function(
    template,
    ItemView) {

    var ActivitiesModel = Backbone.Collection.extend({

        idAttribute: "_id",

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url: function() {
            return this.document.url() + '/activities';
        }
    });

    return Backbone.Marionette.CompositeView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // item view container
        itemViewContainer: '.timeline-block',

        // item view
        itemView: ItemView,

        // initializer
        initialize: function() {

            var self = this;

            this.collection = new Backbone.Collection();

            var rawData = new ActivitiesModel();
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