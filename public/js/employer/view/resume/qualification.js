define([
    'view/common/item-base',
    'text!template/resume/qualification.html'
], function(
    BaseView,
    template) {

    var QualificationItem = BaseView.extend({

        // template
        template: template,

        className: 'sl-editable',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'date': 'input[name="acquireDate"]',
                'name': 'input[name="name"]',
                'remove': '.btn-remove'
            });

            this.events = _.extend({}, this.events, {
                'change input[name="acquireDate"]': 'updateDate',
                'change input[name="name"]': 'updateName',
                'click .btn-remove': 'removeModel'
            });
        },

        // after render
        onRender: function() {

            // append data picker
            this.ui.date.datepicker({
                autoclose: true,
                startView: 2,
                minViewMode: 1,
                endDate: new Date(),
                format: 'yyyy/mm',
                language: 'ja'
            });

            // enable mask input
            this.ui.date.mask('9999/99');
        },

        updateDate: function() {
            this.model.set('acquireDate', this.ui.date.val());
            this.render();
        },

        updateName: function() {
            this.model.set('name', this.ui.name.val());
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

    return QualificationItem;
});