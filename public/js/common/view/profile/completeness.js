define([
    'text!common/template/profile/completeness.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                progress: '.progress',
                bar: '.progress-bar'
            });

            // listen on property change for update completeness
            this.modelEvents = {
                'change': 'updateCompleteness'
            };

            this.model.set({'completeness': this.model.completeness()}, {silent: true});
        },

        updateCompleteness: function() {

            var completeness = this.model.completeness(),
                progressClass = "progress-bar";

            if (completeness == 100) {
                progressClass += ' progress-bar-success';
            } else if (completeness > 85) {
                // progressClass = 'progress-bar';
            } else if (completeness > 70) {
                progressClass += ' progress-bar-warning';
            } else if (completeness > 50) {
                progressClass += ' progress-bar-pink';
            } else {
                progressClass += ' progress-bar-danger';
            }

            this.ui.progress.attr('data-percent', '完成度：' + completeness + '%');
            this.ui.bar.removeClass().addClass(progressClass);
            this.ui.bar.css('width', completeness + '%');
        },

        onRender: function() {
            // add tooltip on add button
            this.$el.find('.progress').tooltip({
                placement: 'bottom',
                title: "プロフィールの完成度です、100%目指していれましょう"
            });
        }

    });
});