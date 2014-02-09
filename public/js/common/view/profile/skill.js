define([
    'common/view/item-base',
    'text!common/template/profile/skill.html'
], function(
    BaseView,
    template) {

    var SkillItem = BaseView.extend({

        // template
        template: template,

        className: 'sl-editable',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input',
                'progress': '.progress-bar',
                'valIndicator': '.icon-nothing',
                'slider': '.sl-slider',
                'remove': '.btn-remove'
            });

            this.events = _.extend({}, this.events, {
                'change input': 'updateModel',
                'click .btn-remove': 'removeModel'
            });
        },

        onRender: function() {

            var self = this;

            this.$el.find('.sl-slider').empty().slider({
                value: this.model.get('weight'),
                range: "min",
                animate: true,
                min: 20,
                max: 100,
                slide: function(event, ui) {

                    var slideClass = 'ui-slider',
                        indecatorClass = 'blue',
                        humanize = '';

                    // change color by value
                    if (ui.value > 85){
                        slideClass = 'ui-slider-green';
                        indecatorClass = 'green';
                        humanize = '（マスタ）';
                    } else if (ui.value > 70) {
                        slideClass = 'ui-slider';
                        indecatorClass = 'blue';
                        humanize = '（シニア）';
                    } else if (ui.value > 50) {
                        slideClass = 'ui-slider-orange';
                        indecatorClass = 'orange';
                        humanize = '（ジュニア）';
                    } else if (ui.value > 30) {
                        slideClass = 'ui-slider-red';
                        indecatorClass = 'red';
                        humanize = '（経験あり）';
                    } else {
                        slideClass = 'ui-slider-purple';
                        indecatorClass = 'purple';
                        humanize = '（知識あり）';
                    }

                    self.ui.slider
                        .removeClass('ui-slider-green ui-slider-orange ui-slider-red ui-slider-purple')
                        .addClass(slideClass);

                    self.ui.valIndicator
                        .removeClass('green orange blue red purple')
                        .addClass(indecatorClass);

                    self.ui.valIndicator.empty().text(ui.value + 'pt' + humanize);
                },
                stop: function(event, ui) {

                    self.model.set('weight', ui.value);

                    var progressClass = 'progress-bar-purple';

                    // change color by value
                    if (ui.value > 85){
                        progressClass = 'progress-bar-success';
                    } else if (ui.value > 70) {
                        progressClass = 'progress-bar';
                    } else if (ui.value > 50) {
                        progressClass = 'progress-bar-warning';
                    } else if (ui.value > 30) {
                        progressClass = 'progress-bar-danger';
                    }

                    self.ui.progress
                        .removeClass('progress-bar-success progress-bar-warning progress-bar-danger progress-bar-purple')
                        .addClass(progressClass)
                        .css('width', ui.value + '%')
                        .find('.pull-right').empty().text(ui.value + 'pt');
                }
            });

            // ?? I did bind on collection....
            Backbone.Validation.bind(this);
        },

        updateModel: function() {

            // clear all errors
            this.clearError();

            var inputData = {skill: this.ui.input.val()};

            // check input value
            var errors = this.model.preValidate(inputData);

            // if input has errors
            if (errors) {
                console.log(errors)
                // show error
                this.showError(errors);
            } else {
                // set value on model
                this.model.set(inputData);
                this.$el.find('.pull-left').empty().text(inputData.skill);
                // this.renderValue(inputData);
            }

            // var skill = this.ui.input.val();

            // this.model.set('skill', skill);
            // if (skill)
        },

        removeModel: function() {

            var self = this;

            this.$el
                .addClass('animated bounceOut')
                .one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd animationend', function() {
                $(this).removeClass('animated bounceOut');
                self.model.collection.remove(self.model);
            });
        }

    });

    return SkillItem;
});