define([
    'text!common/template/password/main.html',
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        // template
        template: template,

        // this view is a modal dialog
        className: 'modal-dialog',

        // ui
        ui: {
            password: 'input[name="password"]',
            password2: 'input[name="password2"]'
        },

        // events
        events: {
            'click .btn-save': 'onSave'
        },

        onSave: function() {

            if (this.ui.password.val().length < 8) {

            } else if (this.ui.password.val() != this.ui.password2.val()) {

            } else {

                this.model.save('password', this.ui.password.val(), {
                    success: function() {
                        selink.modalArea.$el.modal('hide');
                    },
                    silent: true,
                    patch: true,
                    wait: true
                });
            }
        }

    });
});