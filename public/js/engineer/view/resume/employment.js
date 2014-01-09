define([
    'view/common/item-base',
    'text!template/resume/employment.html'
], function(
    BaseView,
    template) {

    var EmploymentItem = BaseView.extend({

        // template
        template: template,

        className: 'sl-editable',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'company': 'input[name="company"]',
                'address': 'input[name="address"]',
                'position': 'input[name="position"]',
                'startDate': 'input[name="startDate"]',
                'endDate': 'input[name="endDate"]',
                'remove': '.btn-remove'
            });

            this.events = _.extend({}, this.events, {
                'change input[name="company"]': 'updateCompany',
                'change input[name="address"]': 'updateAddress',
                'change input[name="position"]': 'updatePosition',
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

        updateCompany: function() {
            this.model.set('company', this.ui.company.val());
            this.render();
        },

        updateAddress: function() {
            this.model.set('address', this.ui.address.val());
            this.render();
        },

        updatePosition: function() {
            this.model.set('position', this.ui.position.val());
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

    return EmploymentItem;
});