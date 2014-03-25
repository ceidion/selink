define([
    'text!employer/template/job/item.html'
], function(
    template) {

    return Backbone.Marionette.ItemView.extend({

        // template
        template: template,

        className: 'job-item col-xs-12 col-sm-6 col-lg-4',

        events: {
            'click .btn-edit': 'editJob',
            'click .btn-remove': 'showAlert',
            'click .btn-remove-cancel': 'hideAlert',
            'click .btn-remove-comfirm': 'onRemove',
        },

        modelEvents: {
            'change': 'render'
        },

        // initializer
        initialize: function() {

        },

        onRender: function() {
            // add tooltip on add button
            this.$el.find('.btn-edit').tooltip({
                placement: 'bottom',
                title: "編集"
            });

            this.$el.find('.btn-remove').tooltip({
                placement: 'bottom',
                title: "削除"
            });

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
                    animate:false,
                    size: size
                }).css('color', barColor);
            });
        },

        editJob: function(event) {
            event.preventDefault();
            this.trigger('edit');
        },

        showAlert: function(event) {

            event.preventDefault();

            var self = this;

            this.$el.find('.alert')
                .slideDown('fast', function() {
                    self.trigger("job:change");
                })
                .find('i')
                .addClass('icon-animated-vertical');
        },

        hideAlert: function() {

            var self = this;

            this.$el.find('.alert').slideUp('fast', function() {
                self.trigger("job:change");
            });
        },

        onRemove: function() {

            var self = this;

            // TODO: maybe I should do this on parent view
            $('.job-container').isotope('remove', this.$el, function() {

                self.model.destroy({
                    success: function(model, response) {
                    },
                    wait: true
                });
            });
        },

    });
});