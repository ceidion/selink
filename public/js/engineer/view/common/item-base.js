define([], function() {

    var BaseItem = Backbone.Marionette.ItemView.extend({

        /*
            Common events may happend
        */
        events: {
            // Switch to edit-mode when the div was clicked
            'click': 'switchToEditor'
        },

        ui: {
            value: '.sl-value',
            editor: '.sl-editor'
        },

        onRender: function(options) {

            var self = this;

            this.$el.find('form').validate(_.extend({}, {

                highlight: function (e) {
                    $(e).addClass('tooltip-error')
                        .closest('.form-group').removeClass('has-success').addClass('has-error')
                        .closest('.sl-editor').addClass('animated-input-error');
                },

                unhighlight: function(e) {
                    $(e).removeClass('tooltip-error').tooltip('destroy')
                        .closest('.form-group').removeClass('has-error').addClass('has-success')
                        .closest('.sl-editor').removeClass('animated-input-error');
                },

                success: function (e) {
                    $(e).remove();
                },

                errorPlacement: function (error, element) {
                    error.insertAfter(element.parent()).addClass('hidden');
                    element.tooltip({
                        placement: 'bottom',
                        title: error.text()
                    });
                },

                submitHandler: function (form) {
                    self.onSignIn();
                }

            }, options));
        },

        /*
            Switch sl-editor from view-mode to edit-mode
        */
        switchToEditor: function() {

            var self = this;

            // fadeOut view panel
            this.ui.value.fadeOut('fast', function() {
                // slideDown edit panel
                self.ui.editor.slideDown('fast');
                // mark this editor as opened
                self.$el.addClass('sl-editor-open');
            });
        },
    });

    return BaseItem;
});