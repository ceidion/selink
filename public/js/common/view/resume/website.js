define([
    'common/view/item-base',
    'text!common/template/resume/website.html'
], function(
    BaseView,
    template) {

    var WebSiteItem = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input'
            });

            // update model when input value changed
            this.events = _.extend({}, this.events, {
                'change input': 'updateModel'
            });

            // listen on webSite property for save
            this.modelEvents = {
                'change:webSite': 'save'
            };
        },

        // after render
        onRender: function() {
            // bind validator
            Backbone.Validation.bind(this);
        },

        updateModel: function() {
            // clear all errors
            this.clearError();

            // check input value
            var errors = this.model.preValidate(this.getData());

            // if input has errors
            if (errors) {
                // show error
                this.showError(errors);
            } else {
                // set value on model
                this.model.set(this.getData());
            }
        },

        getData: function() {
            return {
                webSite: this.ui.input.val()
            };
        },

        renderValue: function(data) {

            if (!data.webSite) {
                this.ui.value.html(this.placeholder);
                return;
            }

            this.ui.value.text(data.webSite);
        }

    });

    return WebSiteItem;
});