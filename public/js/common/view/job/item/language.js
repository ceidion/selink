define([
    'text!common/template/job/item/language.html',
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        // template
        template: template,

        // class name
        className: 'center',

        // initializer
        initialize: function() {

            if (this.model.collection.length === 2)
                this.$el.addClass('grid2');
            else if (this.model.collection.length > 2)
                this.$el.addClass('grid3');
        },

        onShow: function() {
            // decorate pie chart
            $('.easy-pie-chart.percentage').each(function(){
                var barColor = $(this).data('color') || '#555';
                var trackColor = '#E2E2E2';
                var size = parseInt($(this).data('size')) || 72;
                $(this).easyPieChart({
                    barColor: barColor,
                    trackColor: trackColor,
                    scaleColor: false,
                    lineCap: 'butt',
                    lineWidth: parseInt(size/10),
                    animate: 1000,
                    size: size
                }).css('color', barColor);
            });
        }

    });
});