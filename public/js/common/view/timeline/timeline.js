define([
    'common/view/composite-base',
    'text!common/template/timeline/timeline.html',
    'common/view/timeline/timeline-item'
], function(
    BaseView,
    template,
    ItemView) {

    var ActivitiesModel = Backbone.Collection.extend({

        idAttribute: "_id",

        model: Backbone.Model.extend({idAttribute: "_id"}),

        url: '/activities/'
    });

    return BaseView.extend({

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

            this.events = _.extend({}, this.events);

            this.collection = new Backbone.Collection();

            var self = this;

            var rawData = new ActivitiesModel();
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