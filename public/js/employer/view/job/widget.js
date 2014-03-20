define([
    'common/view/item-base',
    'text!employer/template/job/widget.html'
], function(
    BaseView,
    template) {

    return BaseView.extend({

        // template
        template: template,

        className: 'job-item col-xs-12 col-sm-6 col-lg-4',

        // icon
        icon: 'icon-envelope-alt',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input'
            });

            // update model when input value changed
            this.events = _.extend({}, this.events, {
                'change input': 'updateModel'
            });

            // listen on name property for save
            this.modelEvents = {
                'change:name': 'save'
            };
        },

        // after render
        onRender: function() {
            // bind validator
            Backbone.Validation.bind(this);
        },

        // reflect user input on model
        updateModel: function() {

            // clear all error
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

        save: function() {

            if (this.model.isNew()) {
                this.collection.add(this.model.toJSON());
                // // this.model.save();
                // console.log(this.model.collection);
            }
        },

        getData: function() {
            return {
                name: this.ui.input.val()
            };
        },

        renderValue: function(data) {

            if (!data.name) {
                this.ui.value.html(this.placeholder);
                return;
            }

            this.ui.value.text(data.name);
        },

        successMsg: function(data) {

            if (!data.name)
                return "メールアドレスはクリアしました。";

            return "メールアドレスは「" + data.name + "」に更新しました。";
        }

    });
});