define([
    'view/common/item-base',
    'text!template/resume/skill.html'
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
                        indecatorClass = 'blue';

                    // change color by value
                    if (ui.value > 85){
                        slideClass = 'ui-slider-green';
                        indecatorClass = 'green';
                    } else if (ui.value > 70) {
                        slideClass = 'ui-slider';
                        indecatorClass = 'blue';
                    } else if (ui.value > 50) {
                        slideClass = 'ui-slider-orange';
                        indecatorClass = 'orange';
                    } else if (ui.value > 30) {
                        slideClass = 'ui-slider-red';
                        indecatorClass = 'red';
                    } else {
                        slideClass = 'ui-slider-purple';
                        indecatorClass = 'purple';
                    }

                    self.ui.slider
                        .removeClass('ui-slider-green ui-slider-orange ui-slider-red ui-slider-purple')
                        .addClass(slideClass);

                    self.ui.valIndicator
                        .removeClass('green orange blue red purple')
                        .addClass(indecatorClass);

                    self.ui.valIndicator.empty().text(ui.value);
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
        },

        updateModel: function() {

            var skill = this.ui.input.val();

            this.model.set('skill', skill);
            if (skill)
                this.$el.find('.pull-left').empty().text(skill);
        },

        removeModel: function() {

            var self = this;

            this.$el.addClass('animated bounceOut');
            this.$el.one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd animationend', function() {
                $(this).removeClass('animated bounceOut');
                self.model.collection.remove(self.model);
            });
        }

    });

    return SkillItem;
});