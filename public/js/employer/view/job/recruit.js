define([
    'common/view/item-base',
    'text!employer/template/job/recruit.html'
], function(
    BaseView,
    template) {

    var RecruitItem = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-bullhorn',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input'
            });

            // update model when input value changed
            this.events = _.extend({}, this.events, {
                'change input': 'updateModel'
            });

            // listen on recruitNum property for save
            this.modelEvents = {
                'change:recruitNum': 'save'
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
                recruitNum: this.ui.input.val()
            };
        },

        renderValue: function(data) {

            if (!data.recruitNum) {
                this.ui.value.html(this.placeholder);
                return;
            }

            this.ui.value.text(data.recruitNum);
        },

        successMsg: function(data) {

            if (!data.recruitNum)
                return "メールアドレスはクリアしました。";

            return "メールアドレスは「" + data.recruitNum + "」に更新しました。";
        }

    });

    return RecruitItem;
});