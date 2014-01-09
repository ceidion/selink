define([
    'view/common/item-base',
    'text!template/resume/education.html'
], function(
    BaseView,
    template) {

    var EducationItem = BaseView.extend({

        // template
        template: template,

        className: 'sl-editable',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'school': 'input[name="school"]',
                'major': 'input[name="major"]',
                'startDate': 'input[name="startDate"]',
                'endDate': 'input[name="endDate"]',
                'remove': '.btn-remove'
            });

            this.events = _.extend({}, this.events, {
                'change input[name="school"]': 'updateSchool',
                'change input[name="major"]': 'updateMajor',
                'change input[name="startDate"]': 'updateStartDate',
                'change input[name="endDate"]': 'updateEndDate',
                'click .btn-remove': 'removeModel'
            });
        },

        // after render
        onRender: function() {

            // append data picker
            this.$el.find('input[name="startDate"],input[name="endDate"]').datepicker({
                autoclose: true,
                startView: 2,
                minViewMode: 1,
                endDate: new Date(),
                format: 'yyyy/mm',
                language: 'ja'
            });

            // enable mask input
            this.$el.find('input[name="startDate"],input[name="endDate"]').mask('9999/99');
        },

        updateSchool: function() {
            this.model.set('school', this.ui.school.val());
            this.render();
        },

        updateMajor: function() {
            this.model.set('major', this.ui.major.val());
            this.render();
        },

        updateStartDate: function() {
            this.model.set('startDate', this.ui.startDate.val());
            this.render();
        },

        updateEndDate: function() {
            this.model.set('endDate', this.ui.endDate.val());
            this.render();
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

    return EducationItem;
});