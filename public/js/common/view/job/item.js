define([
    'text!common/template/job/item.html',
    'common/view/job/item/languages',
    'common/view/job/item/skills'
], function(
    template,
    Languages,
    Skills
) {

    return Backbone.Marionette.Layout.extend({

        // template
        template: template,

        className: 'job-item col-xs-12 col-sm-6 col-lg-4',

        events: {
            'click .btn-edit': 'editJob',
            'click .btn-remove': 'showAlert',
            'click .btn-remove-cancel': 'hideAlert',
            'click .btn-remove-comfirm': 'onRemove',
            'mouseover': 'toggleMenuIndicator',
            'mouseout': 'toggleMenuIndicator'
        },

        regions: {
            'languageArea': '#language',
            'skillArea': '#skill'
        },

        modelEvents: {
            // 'change': 'render'
        },

        // initializer
        initialize: function() {

        },

        onRender: function() {

            this.languagesView = new Languages({
                collection: this.model.languages
            });

            this.skillsView = new Skills({
                collection: this.model.skills
            });
        },

        onShow: function() {

            this.languageArea.show(this.languagesView);
            this.skillArea.show(this.skillsView);
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
                    self.trigger("shiftColumn");
                })
                .find('i')
                .addClass('icon-animated-vertical');
        },

        hideAlert: function() {

            var self = this;

            this.$el.find('.alert').slideUp('fast', function() {
                self.trigger("shiftColumn");
            });
        },

        onRemove: function() {
            this.trigger('remove');
        },

        // show operation menu indicator
        toggleMenuIndicator: function() {
            this.$el.find('.widget-header .widget-toolbar').toggleClass('hidden');
        }
    });
});